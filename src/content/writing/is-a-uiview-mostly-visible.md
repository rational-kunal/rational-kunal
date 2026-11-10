---
title: "Is UIView (mostly) visible"
description: "isHidden and alpha do not tell you whether anyone can actually see a view. Intersecting frames does."
published: 2024-05-25
tags: ["swift", "ios"]
readingTime: 1
devto: "https://dev.to/rationalkunal/is-uiview-mostly-visible-59jf"
draft: false
---
If you've ever needed to check whether a view is visible to the user, you might have used the `isHidden` property. However, this method falls short in scenarios where a view can appear hidden due to overlapping by other views. To address this, I created a simple extension to provide a more comprehensive visibility check.

```swift
extension UIView {

    /// Checkes if the view is (mostly) visible to user or not.
    /// Internaly it checks following things
    ///  - Should NOT be hidden
    ///  - Should NOT be completely transparent
    ///  - Bound should NOT be empty
    ///  - Should be in some window i.e. in view heirarchy
    ///  - Center should be directly visible to user i.e. NOT overlapped with other views
    var isMostlyVisible: Bool {
        guard !isHidden,
              alpha > 0,
              !bounds.isEmpty,
              let window,
              window.hitTest(window.convert(center, from: self.superview), with: nil) == self else {
            return false
        }

        return true
    }

}
```

Here is the extension in action:


![Image description](/writing/is-a-uiview-mostly-visible/cfdeacb8.gif)


Thank you for reading.
