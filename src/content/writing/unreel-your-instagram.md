---
title: "ReverseEngineering[0]: UnReel your Instagram"
description: "Dumping headers, finding the class behind a feed item and swizzling the reel check, to see whether an app I did not build could be changed from the outside."
published: 2024-07-30
tags: ["ios", "reverseengineering", "instagram"]
readingTime: 3
devto: "https://dev.to/rationalkunal/reverseengineering0-unreel-your-instagram-1gh6"
draft: false
---
For a long time, I have wondered whether it's possible to externally modify the content of iOS apps.

Then I came across Bryce's video: [Modding TikTok to only show Cat Videos](https://youtu.be/YW3jL2gI9IE?si=opnrz0EanQT-Odps) 
It was amazing to see how he altered the TikTok app to display only cat videos. This video helped me understand the process of reverse engineering an iOS app and modifying its code flow.

## A New Challenge: Blocking Instagram Reels
To understand and learn reverse engineering myself, I tried hacking in a patch to disable Instagram Reels.
_(A bit of context: I kept involuntarily opening Instagram and going to the reels tab in my free time. So, I wanted to modify the app to prevent this.)_

## Get the decrypted `ipa` file of Instagram
Like the `.apk` file on Android, iOS uses the `.ipa` file format, the "iOS package for the App Store".
Apple encrypts the .ipa file downloaded from the app store, making it impossible to directly use for reverse engineering.
According to the video, I obtained the debuggable `.ipa` from [https://armconverter.com/decryptedappstore/us/instagram](https://armconverter.com/decryptedappstore/us/instagram).
## FLEXify the Instagram
[FLEX](https://github.com/FLEXTool/FLEX) is a tool for debugging UI, memory, network, and other issues. It is much easier than debugging via terminal, so I am integrating this first.
To do this (and to add our future script to modify content), we need to create a new framework, preferably in Objective C. We can create a Framework from `Xcode` > `Create New Project` > `iOS` > `Framework`. 
We should add the code there to launch the FLEX tool after a 2-second delay.

```objc
#import <FLEX.h>

@implementation NoReels

+ (void)load {
    // After 2s launch flex tool
    dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(2 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
        [FLEXManager.sharedManager showExplorer];
    });
}

@end
```

## Injecting the Framework
To inject this framework, use the [sideloadly](https://sideloadly.io). It installs `.ipa` files on iPhones without requiring them to be jailbroken. I am still determining how this works, but you just need to add your framework. After building the framework source, you can find the framework in `Product` > `Show Build Folder in Finder`.

<img src="https://raw.githubusercontent.com/rational-kunal/Assets/main/InjectFramework.png" alt="Sideloadly set up to inject the built framework into the Instagram .ipa." width="1424" height="2060" loading="lazy" decoding="async" style="max-width:min(100%,300px);height:auto" />

## Unwanted crashing
After I launched the app, it crashed with the following exception
```
Thread 1: "*** -[NSFileManager enumeratorAtURL:includingPropertiesForKeys:options:errorHandler:]: URL is nil"
```

I couldn't deduce the issue without direct access to the code, but it seemed that an invalid parameter was being sent to the method above. To explore possible solutions, I swizzled the method to only call the original method when the parameters passed to it were valid.

```objc
@interface NSFileManager (Swizzling)
@end

@implementation NSFileManager (Swizzling)

+ (void)load {
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        Class class = [self class];
        
        SEL originalSelector = @selector(enumeratorAtURL:includingPropertiesForKeys:options:errorHandler:);
        SEL swizzledSelector = @selector(swizzled_enumeratorAtURL:includingPropertiesForKeys:options:errorHandler:);
        
        Method originalMethod = class_getInstanceMethod(class, originalSelector);
        Method swizzledMethod = class_getInstanceMethod(class, swizzledSelector);
        
        method_exchangeImplementations(originalMethod, swizzledMethod);
    });
}

- (NSDirectoryEnumerator<NSURL *> *)swizzled_enumeratorAtURL:(NSURL *)url
     includingPropertiesForKeys:(NSArray<NSURLResourceKey> *)keys
                        options:(NSDirectoryEnumerationOptions)mask
                   errorHandler:(BOOL (^)(NSURL *url, NSError *error))handler {
    if (url == nil) {
        NSLog(@"[NoReels] enumeratorAtURL called with nil url");
        return nil;
    }

    return [self swizzled_enumeratorAtURL:url includingPropertiesForKeys:keys options:mask errorHandler:handler];
}

@end
```

This bit of code fixed the crash! So now I was able to launch instagram with the FLEX tool.

<img src="https://raw.githubusercontent.com/rational-kunal/Assets/main/FlexifyInstagram.gif" alt="Instagram launching with the FLEX debugging tool overlaid on the running app." width="800" height="1733" loading="lazy" decoding="async" style="max-width:min(100%,300px);height:auto" />

## Debugging the UI
With the Flex tool, I found the reel button displayed using `IGTabBarButton`  inside the `IGTabBarController` view controller. I also found a method `-[IGTabBarController _discoverVideoButtonPressed]` that seems to have been used to launch the reels tab.

<img src="https://raw.githubusercontent.com/rational-kunal/Assets/main/Instagram_DiscoverNavigation.gif" alt="FLEX showing IGTabBarButton inside IGTabBarController as the reels tab is tapped." width="800" height="1733" loading="lazy" decoding="async" style="max-width:min(100%,300px);height:auto" />
## Blocking the Reels Tab
So, to block the reels tab, we can swizzle the above method to launch a new view controller of our choosing instead of the original execution to open reels.

```objc
#import "NoReels.h"
#import <objc/runtime.h>


@implementation NoReels

+ (void)load {
    // Swizzle `-[IGTabBarController _discoverVideoButtonPressed]` to call our implementation
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        Class igTabBarControllerClass = NSClassFromString(@"IGTabBarController");
        
        SEL originalSelector = NSSelectorFromString(@"_discoverVideoButtonPressed");
        SEL swizzledSelector = @selector(swizzled_discoverVideoButtonPressed);
        
        Method swizzledMethod = class_getInstanceMethod(self, swizzledSelector);

        class_addMethod(igTabBarControllerClass,
                        method_getName(swizzledMethod),
                        method_getImplementation(swizzledMethod),
                        method_getTypeEncoding(swizzledMethod));
        
        Method originalMethod = class_getInstanceMethod(igTabBarControllerClass, originalSelector);
        Method addedMethod = class_getInstanceMethod(igTabBarControllerClass, swizzledSelector);
        
        method_exchangeImplementations(originalMethod, addedMethod);
    });
}

// Launch a meme view controller
- (void)swizzled_discoverVideoButtonPressed {
    UIViewController *topController = [UIApplication sharedApplication].keyWindow.rootViewController;
    while (topController.presentedViewController) {
        topController = topController.presentedViewController;
    }

    UIViewController *memeVC = [[MemeImageViewController alloc] init];
    [topController presentViewController:memeVC animated:YES completion:nil];
}

@end
```


With this, the user will see a meme view controller upon tapping the reel button.

<img src="https://raw.githubusercontent.com/rational-kunal/Assets/main/Instagram_SayNoToReels.gif" alt="Tapping the reels tab in Instagram and landing on a meme screen instead." width="800" height="1733" loading="lazy" decoding="async" style="max-width:min(100%,300px);height:auto" />

## Conclusion
This was a basic introduction to reverse engineering for me, demonstrating how to reverse engineer and implement patches for iOS applications. This will also help me with my Instagram addiction. 

Thank you.

[https://github.com/rational-kunal/NoReelsOnInstagram](https://github.com/rational-kunal/NoReelsOnInstagram)
[https://github.com/rational-kunal](https://github.com/rational-kunal)
