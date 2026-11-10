---
title: "NSLog (Debugging) Cheat Sheet"
description: "Format specifiers, object printing and the logging flags worth remembering when you are deep in an Objective-C stack."
published: 2023-04-22
tags: ["ios", "objc", "beginners"]
readingTime: 1
devto: "https://dev.to/rationalkunal/nslog-debugging-cheat-sheet-100d"
draft: false
---
Purpose of this cheat sheet is to explore debugging tools for logging.

### Frequently used format specifiers:
| Type | Format specifier |
| --- | --- |
| Object (prints description) | `%@` |
| `NSInteger` | `%ld` |
| `NSUInteger` | `%lu` |
| `CGFloat` | `%f` |
| `pointer` | `%p` |
More format specifiers are available on: [String Format Specifiers ~ Apple Documentation](https://developer.apple.com/library/archive/documentation/Cocoa/Conceptual/Strings/Articles/formatSpecifiers.html#//apple_ref/doc/uid/TP40004265-SW1)

### Helper method to translate objects/structures into `NSString`:
| Function | Description |
| --- | --- |
| `NSStringFromClass` | Returns the name of a class as a string. |
| `NSStringFromCGRect` | Returns a string formatted to contain the data from a rectangle in `{{x, y}, {width, height}}` format. |
| `NSStringFromCGSize` | Returns a string formatted to contain the data from a size data structure in `{width, height}` format. |
| `NSStringFromCGPoint` | Returns a string formatted to contain the data from a point in `{x, y}` format. |
| `NSStringFromRange` | Returns a string representation of a range in `{location, length}` format. |
More (less used) methods:
- `NSStringFromSelector`
- `NSStringFromProtocol`
- `NSStringFromCGVector`
- `NSStringFromMapTable`
- `NSStringFromUIOffset`
- `NSStringFromHashTable`
- `NSStringFromCGAffineTransform`
- `NSStringFromDirectionalEdgeInsets`

### Debugging wrapper for NSLog
```objc
#define Debug(fmt, ...) NSLog((@"%s [Line %d] " fmt), __PRETTY_FUNCTION__, __LINE__, ##__VA_ARGS__)
```

### Log a backtrace of your stack
```objc
NSLog(@"%@", [NSThread callStackSymbols]);
```
```
2023-04-22 22:37:20.001544+0530 just-objc[5829:186391] (
	0   just-objc                           0x000000010099dda8 -[ViewController viewDidLoad] + 84
	
<trimmed ...>

	28  UIKitCore                           0x0000000107ebeff0 -[UIApplication _run] + 868
	29  UIKitCore                           0x0000000107ec2f3c UIApplicationMain + 124
	30  just-objc                           0x000000010099e024 main + 120
	31  dyld                                0x0000000100b2d514 start_sim + 20
	32  ???                                 0x0000000100d85f28 0x0 + 4309147432
	33  ???                                 0xdf35000000000000 0x0 + 16083761644223594496
)
```
