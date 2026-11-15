---
title: "I used an AI agent to make my Instagram boring"
description: "I can't delete Instagram, so I injected a framework that adds friction to its endless parts. A coding agent did most of the digging, once FLEX gave it a map."
published: 2026-11-15
tags: ["ios", "ai", "reverseengineering", "instagram"]
ai: true
draft: false
---
<aside class="note">a follow-up to my 2024 post, which blocked Reels outright</aside>

Back in 2024 I [blocked the Reels tab](/writing/unreel-your-instagram) on my Instagram by injecting a small framework into the app. Tapping Reels showed a meme instead. It worked for a while, but it was a blunt fix.

The thing is, I can't just delete Instagram. My friends are there, memes get sent on DM, and I do like seeing what people are up to. What I don't like is looking up and realizing 60 minutes are gone.

<aside class="note">the whole post in one line</aside>

So this time the goal was different. <mark>Keep the useful parts, and add friction to the endless parts.</mark> AI coding agents have also gotten really good since my last post, so I wanted to see how far I could get if I let the agent do the heavy lifting.

Further than I expected. Most of it came together in a single afternoon. I started with a hello world around lunch, and by evening Instagram had stopped crashing, the Explore reel grid was gone and a reel from a friend was just one reel.

> 💻 **The code is here: [github.com/rational-kunal/NotTheInstagram](https://github.com/rational-kunal/NotTheInstagram)**

## What my Instagram does now

<div class="board">
<figure>
  <div class="stage">
    <video class="phone" src="/writing/make-instagram-boring-with-an-ai-agent/home-feed.mp4" poster="/writing/make-instagram-boring-with-an-ai-agent/home-feed.jpg" width="400" height="870" aria-label="The Instagram Home feed stops at a spinner after three posts, then reveals the next three" loop muted playsinline controls></video>
    <p class="hand">3 posts, then a wait</p>
  </div>
  <figcaption>
    <b>The home feed shows 3 posts, then makes me wait. 8 seconds, then 11, then 14.</b>
    <span>From the third wait on, it stays at 14 seconds.</span>
  </figcaption>
</figure>
<figure>
  <div class="stage">
    <img src="/writing/make-instagram-boring-with-an-ai-agent/explore.png" class="phone" width="560" height="1218" loading="lazy" decoding="async" alt="Instagram's Explore tab with the search bar at the top and a magnifying glass in place of the reel grid">
    <p class="hand">no grid, just search</p>
  </div>
  <figcaption>
    <b>The Explore reel grid is gone. Search still works.</b>
    <span>A magnifying glass sits where the grid used to be. I can still look people up. I just don't get the infinite wall of thumbnails.</span>
  </figcaption>
</figure>
<figure>
  <div class="stage">
    <video class="phone" src="/writing/make-instagram-boring-with-an-ai-agent/reels-pause.mp4" poster="/writing/make-instagram-boring-with-an-ai-agent/reels-pause.jpg" width="400" height="870" aria-label="Opening Reels shows the pause screen. After the wait, tapping Continue for this session opens the first reel." loop muted playsinline controls></video>
    <p class="hand">2 minutes of staring first</p>
  </div>
  <figcaption>
    <b>The Reels tab opens on a pause screen. I can get in, but only after 2 minutes of staring at it.</b>
    <span>The "Continue for this session" button only shows up if I keep the "Reels are paused" screen open the whole time. Leaving the tab or closing the app resets the timer.</span>
    <span>Two minutes doesn't sound like much. But staring at a pause screen for two minutes is long enough to ask myself why I opened Reels in the first place. Most of the time I don't have a good answer.</span>
  </figcaption>
</figure>
<figure>
  <div class="stage">
    <video class="phone" src="/writing/make-instagram-boring-with-an-ai-agent/reels-delay.mp4" poster="/writing/make-instagram-boring-with-an-ai-agent/reels-delay.jpg" width="400" height="870" aria-label="Reels go from a blurred screen with a pause icon to playing. I swipe past another reel while it's still paused." loop muted playsinline controls></video>
    <p class="hand">each reel waits longer</p>
  </div>
  <figcaption>
    <b>Every reel waits a few seconds before it plays, and the wait grows with each reel.</b>
    <span>Once I am in, the first reel waits 3 seconds behind a blur with a pause icon. Each new reel adds half a second. By the 20th reel it's 12.5 seconds of waiting, and scrolling stops feeling effortless.</span>
    <span>The video isn't just hidden behind the blur. Playback itself waits, so no audio sneaks through either.</span>
  </figcaption>
</figure>
<figure>
  <div class="stage">
    <video class="phone" src="/writing/make-instagram-boring-with-an-ai-agent/dm-reel.mp4" poster="/writing/make-instagram-boring-with-an-ai-agent/dm-reel.jpg" width="400" height="870" aria-label="A reel opens from an Instagram DM and keeps playing through upward swipes. The sender's name and photo are blurred." loop muted playsinline controls></video>
    <p class="hand">one reel, no swiping</p>
  </div>
  <figcaption>
    <b>A reel someone sends me plays alone. No swiping into the next one.</b>
    <span>Swiping and auto-advance are turned off for reels opened from DMs. This was the sneakiest trap for me. One reel from a friend used to turn into twenty from strangers.</span>
  </figcaption>
</figure>
<figure>
  <div class="stage" style="--at: 80%">
    <img src="/writing/make-instagram-boring-with-an-ai-agent/usage-label.png" class="phone" width="560" height="1218" loading="lazy" decoding="async" alt="Instagram's Home feed with the time spent label at the bottom reading Today 1h 8m and This week 1h 8m">
    <p class="hand">time spent today and this week</p>
  </div>
  <figcaption>
    <b>A small label at the bottom shows how long I have been on Instagram today and this week.</b>
    <span>It doesn't block any taps. It just keeps the number in front of me.</span>
  </figcaption>
</figure>
</div>

Everything else in Instagram works pretty much the same.

## The setup

Same base as last time: a decrypted Instagram IPA, a framework I build in Xcode, and [Sideloadly](https://sideloadly.io/) to inject it and install the app on my iPhone.

If those words are new: an IPA is the iOS app package (like an APK on Android). A framework is a bundle of code. Sideloadly unpacks the IPA, adds my framework, re-signs everything with my Apple account and installs it. When Instagram launches, my code loads with it and can change how Instagram's classes behave.

<figure>
  <img src="/writing/make-instagram-boring-with-an-ai-agent/sideloadly.png" width="840" height="1064" loading="lazy" decoding="async" alt="Sideloadly with the Instagram IPA selected and the framework added under Tweak Injection" style="max-width:min(100%,420px);height:auto">
</figure>

New this time:

- [Codex](https://openai.com/codex/): the AI coding agent I worked with.
- [Hopper](https://www.hopperapp.com/): a disassembler. It opens Instagram's ~400 MB executable and lists the classes and methods inside. The free demo was enough, though it closes every 30 minutes.
- [REA (Reverse Engineer Anything)](https://github.com/morluto/rea): connects the agent to Hopper, so it can search the binary and read the disassembly on its own.
- [FLEX](https://github.com/FLEXTool/FLEX): an in-app debugger. It ended up being the most important tool here, more on that later.

### AGENTS.md first

Since I was going AI first, I started with an `AGENTS.md`, the file coding agents read before doing anything in a repo. I thought I would write it once. I rewrote it a few times. Here's the important part of the current version ([full file](https://github.com/rational-kunal/NotTheInstagram/blob/main/AGENTS.md)):

```md
This experimental project aims to reduce addictive Instagram behaviors
through an injected framework.

There should be minimal impact on the user experience apart from the intended
behavior changes, and the framework should be designed to be as robust as possible.

Keep agent-generated notes, plans, intermediate results, lessons, and material
for future reading in `agents/` by default.

The intended workflow is to build the framework as an XCFramework, inject
it into Instagram with Sideloadly, and refine it using the user's on-device
test results. Do not assume an on-device test has passed without evidence.

The Hopper demo may have less than 30 minutes remaining. If the timer expires
and Hopper is still needed, pause the work that requires Hopper, ask the user
to relaunch it, and resume once Hopper is available again.
```

Two lines in there do most of the work.

"Keep notes in `agents/`" means every investigation leaves a written record: which class, which method, what was tested on the phone and what wasn't. When I start a new session days later, the agent reads those notes instead of digging through the binary again.

"Do not assume an on-device test has passed" is there because the agent can build and run checks on my Mac, but only my phone can tell if Instagram actually behaves.

The project layout:

```
NotTheInstagram/
├── AGENTS.md                         # instructions every agent reads first
├── NotTheInstagramFrameworkCode/     # Xcode project
│   └── NotTheInstagramFrameworkCode/
│       ├── Features/                 # Home feed, Reels, Explore, usage label
│       ├── Compatibility/            # login storage fix, TestFlight prompt
│       ├── Diagnostics/              # FLEX
│       └── Runtime/                  # shared hook helpers
├── scripts/
│   └── build-framework.sh            # builds the framework for Sideloadly
├── latest-framework/                 # build output, goes into Sideloadly
├── original-decrypted-ipa/
│   └── <version>/                    # the IPA and its unzipped copy (not in git)
└── agents/                           # notes, investigations, AI scratch work
```

## Hello world, then two bugs

For hello world I wanted an alert to pop up when Instagram opens. I asked the agent to set up the framework, then built it, injected it and opened Instagram on my phone. The alert showed up. So did two problems:

1. Instagram couldn't log me in automatically. Every launch, log in again.
2. Instagram crashed. Sometimes right away, sometimes a few minutes after opening.

<figure>
  <img src="/writing/make-instagram-boring-with-an-ai-agent/image.png" class="phone" width="560" height="1218" loading="lazy" decoding="async" alt="Instagram showing &quot;We couldn't log you in automatically&quot;">
</figure>

My gut said these two were connected, and they were. I gave the agent the crash reports and console logs from my phone. The console showed the same keychain error on reads, updates and writes (shortened):

```text
securityd  Instagram  copy_matching  Code=-34018
  Client explicitly specifies access group group.com.facebook.family
  but is only entitled for (...)

securityd  Instagram  update         Code=-34018
securityd  Instagram  add            Code=-34018
```

When Sideloadly re-signs Instagram with my Apple account, the app gets my identity instead of Meta's. But Instagram still asks iOS for Meta's shared storage: a keychain group where login data lives, and a folder that Meta's apps share. iOS refuses both, because my copy isn't Meta's. That's the login problem.

The crash comes from the folder. Its lookup returns `nil`, and later Instagram passes that `nil` into `hasPrefix:`, which throws an exception and takes the app down.

Funny thing, my last post had an `NSFileManager` crash too. Back then I patched around it without really knowing why. This time I got the actual reason.

The fix is a small adapter in the framework. Instagram's original call always runs first. If iOS refuses one of those Meta locations, the adapter hands back a folder inside the app's own container, and retries the keychain call with a group my signing identity is allowed to use. Login data still stays in the iOS keychain. After one manual login, it stayed logged in.

A smaller annoyance showed up later: sideloaded Instagram kept showing a TestFlight "update available" screen on launch, so the framework skips it.

## Giving the agent a map

<aside class="note">~400 MB, thousands of classes</aside>

Next I wanted to change actual features. I asked the agent to find the Explore grid and hide it, and it went in circles. Instagram's executable is around 400 MB with thousands of classes, and "the Explore grid" doesn't mean anything in there. The agent kept guessing class names and searching for each one.

If I were doing this by hand, I would want a starting point: the name of the class that's on screen.

That's exactly what FLEX gives you. I added it to the framework. A three-finger double tap, or holding the usage label for a second, opens it. Tap any view and FLEX shows its class name and where it sits in the view tree.

<div class="board">
<figure>
  <div class="stage" style="--at: 36%">
    <img src="/writing/make-instagram-boring-with-an-ai-agent/image-1.png" class="phone" width="560" height="1218" loading="lazy" decoding="async" alt="FLEX view hierarchy inside Instagram, with the Explore tab button selected">
    <p class="hand">this is the map</p>
  </div>
  <figcaption>The view tree, with the Explore tab button selected.</figcaption>
</figure>
<figure>
  <video class="phone" src="/writing/make-instagram-boring-with-an-ai-agent/flex.mp4" poster="/writing/make-instagram-boring-with-an-ai-agent/flex.jpg" width="400" height="870" aria-label="FLEX opens from the usage label and shows a Home feed view's class and view hierarchy" loop muted playsinline controls></video>
  <figcaption>I hold the usage label to open FLEX, then inspect a view on the Home feed.</figcaption>
</figure>
</div>

So my loop became:

1. Open FLEX on the screen I want to change.
2. Note the class names around it (`IGExploreViewController`, `IGExploreGridViewController`, `IGListCollectionView`).
3. Give those names to the agent and let it search Hopper from there.

This made a huge difference. <mark>The agent stopped spiraling and went straight to the right methods.</mark> If you're using AI on a big codebase you don't know, give it a starting point. It's fast once it knows where to look.

<figure>
  <img src="/writing/make-instagram-boring-with-an-ai-agent/prompt-crop.png" width="1225" height="800" loading="lazy" decoding="async" alt="My prompt to Codex with FLEX screenshots attached, and its reply pointing to IGExploreGridViewController" style="max-width:min(100%,560px);height:auto">
  <figcaption>I attached three FLEX screenshots. Codex found the Explore grid's own controller in under two minutes.</figcaption>
</figure>

## From class name to hook

Once FLEX and Hopper point to the right method, the change itself is a hook. When Instagram calls that method, my code runs instead, and it can still call Instagram's original version. So I only change the part I care about. This works because Objective-C picks which code to run for a method while the app is running, so a framework loaded into the app can swap it.

Here's the Explore one, trimmed. When the framework loads, it finds Instagram's grid class by name and hooks its `viewWillLayoutSubviews`:

<aside class="note" style="--at: 17rem">the class name from FLEX</aside>

```objc
static void NTIGridWillLayout(UIViewController *controller, SEL selector) {
    // Let Instagram do its normal layout first
    ((void (*)(id, SEL))NTIOriginalGridWillLayout)(controller, selector);

    // Then hide the grid and put a magnifying glass where it was
    // ...
}

+ (void)load {
    // Only run inside Instagram
    if (!NTIIsInstagram(NSBundle.mainBundle.bundleIdentifier)) return;

    Class grid = NSClassFromString(@"IGExploreGridViewController");
    const NTIHook hook = {"viewWillLayoutSubviews", (IMP)NTIGridWillLayout,
                          &NTIOriginalGridWillLayout, @encode(void), 0, {NULL}};
    NTIInstallHooks(grid, &hook, 1);
}
```

`NTIInstallHooks` is the part I care about most. Before replacing anything, it checks that the method exists with exactly the argument and return types I expect. Instagram updates often. If a method gets renamed or changed, the check fails and only that feature turns off. Instagram keeps working. Every hook in the project goes through this check.

## Working with the agent

The agent wrote most of the code, much faster than I could have. But I was the one driving.

It kept going off in different directions, and my job was to notice and point it back. The turning points in this project came from those moments: adding FLEX when it was lost in the binary, and guessing that the login bug and the crash were the same problem.

## Try it yourself

If you want to experiment:

1. Install [Sideloadly](https://sideloadly.io/), [Hopper](https://www.hopperapp.com/) (the demo is fine) and [REA](https://github.com/morluto/rea) if you want your agent to read the binary.
2. Do a hello world injection first. My [last post](/writing/unreel-your-instagram) walks through it. Seeing your own alert pop up inside Instagram is weirdly satisfying.
3. Clone [the repo](https://github.com/rational-kunal/NotTheInstagram) and let your coding agent take it from there. `AGENTS.md` tells it how to build (or run `./scripts/build-framework.sh` yourself). Inject the framework into your own decrypted Instagram IPA with Sideloadly (I can't share that part), then ask the agent for whatever you want to change.

Everything was found on Instagram 455.0.0. On other versions some hooks might not match, and those features just stay off. Each feature lives in its own file under `Features/`, so adding one is mostly: find the class with FLEX, find the method in Hopper, write the hook.

One heads-up: Instagram doesn't allow modified clients, so try this on an account you're okay experimenting with.

If this helped you or you just liked it, a ⭐ on the repo would make my day.

## Want something changed in Instagram?

You don't need to be technical for this. [Open an issue](https://github.com/rational-kunal/NotTheInstagram/issues/new) and describe what you want Instagram to do, or stop doing. Plain English is perfect. A few things already on my list: hide like counts, turn the app grayscale after 30 minutes, hide "Suggested for you" posts in the feed.

If your idea is interesting, I'll try building it. And if you're working on something similar (digital wellbeing, iOS tooling, building with AI agents), I would love to chat.

Thank you.
