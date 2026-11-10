---
title: "Let’s highlight"
description: "Our pull requests kept needing annotated screenshots, so I made the app let you draw the border yourself, in place."
published: 2024-06-02
tags: ["ios", "swift", "opensource"]
readingTime: 4
devto: "https://dev.to/rationalkunal/lets-highlight-5lc"
draft: false
---
Our team has been diligently adding screenshots to highlight the UI improvements made by PRs. While this approach has been beneficial in pinpointing changes, it has become a cumbersome task when multiple UI elements are updated. The need to adhere to this guideline often results in the addition of numerous screenshots, which is a time-consuming process.

That's when I had a breakthrough: What if we could draw a border directly in the app to highlight changes? This would eliminate the bottleneck of manually adding borders by quick edit.
And here we are.

The plan is to create border drawing functionality:
- A simple keypress should trigger it.
- It should be separate from the app, i.e., the drawing should not affect it.
- We should be able to draw rectangles by just swiping.

## Trigger drawing functionality by keyboard keypress
I had already seen similar functionality in the FLEX tool, so that was my starting point. Interestingly, an app on a simulator captures keyboard events with `UIPhysicalKeyboardEvent` and exposes `_modifiedInput`, `_isKeyDown`, etc. As these are internal classes and Swift is a type-safe language, we need to use key-value pairs to access those. To intercept all events to the application, swizzled `UIApplication.sendEvent(_:)`. 

```swift
// Hack: To look into keyboard events
extension UIEvent {
    var modifiedInput: String? { self.value(forKey: "_modifiedInput") as? String }
    var isKeyDown: Bool? { self.value(forKey: "_isKeyDown") as? Bool }
}

class ShortcutManager {
    var actionsForKeyInputs: [String: () -> Void] = [:]

    // Registers a action to be performed when "key" is presseed by user
    // Note: This will override existing action for the "key"
    func registerShortcut(withKey key: String, action: @escaping () -> Void) {
        actionsForKeyInputs[key] = action
    }

    func handleKeyboardEvent(pressedKey: String) {
        if let action = actionsForKeyInputs[pressedKey] {
            action()
        }
    }

    func interceptedSendEvent(_ event: UIEvent) {
        guard event.isKeyDown ?? false else { return }
        if let input = event.modifiedInput {
            handleKeyboardEvent(pressedKey: input)
        }
    }
}

// Handle siwizzling: Just call `performSwizzling()`
// Expect call to `ShortcutManager.interceptedSendEvent(_: UIEvent)` when any event is performed on `UIApplication`.
extension ShortcutManager {
    static func _swizzle() {
        let originalSelector = #selector(UIApplication.sendEvent(_:))
        let swizzledSelector = #selector(UIApplication.swizzled_sendEvent(_:))

        guard let originalMethod = class_getInstanceMethod(UIApplication.self, originalSelector),
              let swizzledMethod = class_getInstanceMethod(UIApplication.self, swizzledSelector) else {
            return
        }

        let didAddMethod = class_addMethod(UIApplication.self, originalSelector, method_getImplementation(swizzledMethod), method_getTypeEncoding(swizzledMethod))

        if didAddMethod {
            class_replaceMethod(UIApplication.self, swizzledSelector, method_getImplementation(originalMethod), method_getTypeEncoding(originalMethod))
        } else {
            method_exchangeImplementations(originalMethod, swizzledMethod)
        }
    }
}

extension UIApplication {
    @objc func swizzled_sendEvent(_ event: UIEvent) {
        ShortcutManager.sharedInstance.interceptedSendEvent(event)

        // Call original
        swizzled_sendEvent(event)
    }
}
```
_<sup>Check out the complete code and a few improvements at [github/rational-kunal/Picaso/ShortcutManager.swift](https://github.com/rational-kunal/Picaso/blob/main/Sources/Draw/ShortcutManager.swift)</sup>_

## Launch drawing functionality separate from the app
We can create a separate `UIWindow` and show it on top of the current window to keep our drawing functionality separate from the app's views. 
I created a `CanvasManager` that will toggle our toggle functionality on the `x` key press.
```swift
class CanvasManager {
    var isCanvasActive: Bool { self.canvasWindow.windowScene != nil }

    /// Default initialization
    /// - Shortcut "x" to toggle canvas
    static func defaultInitialization() {
        ShortcutManager.sharedInstance.registerShortcut(withKey: "x",
                                                        action: {
            CanvasManager.sharedInstance.toggleCanvas()
        })
    }

    public func toggleCanvas() {
        isCanvasActive ? hideCanvas() : showCanvas()
    }

    public func showCanvas() {
        guard let windowScene = UIApplication.shared.activeWindowScene else { return }
        canvasWindow.rootViewController = makeRootViewController()
        canvasWindow.windowScene = windowScene
        canvasWindow.isHidden = false
    }

    public func hideCanvas() {
        canvasWindow.rootViewController = nil
        canvasWindow.windowScene = nil
        canvasWindow.isHidden = true
    }
}
```
_<sup>Check out the full code at [github/rational-kunal/Picaso/CanvasManager.swift](https://github.com/rational-kunal/Picaso/blob/main/Sources/Draw/CanvasManager.swift)</sup>_

## Draw!
To draw a border, I created a subclass of `UIView` and maintained `startPoint` and `endPoint`. We will update those in `touchesBegan()` and `touchesMoved()`. Finally, draw the rectangle from `startPoint` and `endPoint` in `draw()`.
```swift
class CanvasView: UIView {
    private var startPoint: CGPoint = .zero
    private var endPoint: CGPoint = .zero

    override func touchesBegan(_ touches: Set<UITouch>, with event: UIEvent?) {
        guard let touch = touches.first else { return }
        startPoint = touch.location(in: self)
    }

    override func touchesMoved(_ touches: Set<UITouch>, with event: UIEvent?) {
        guard let touch = touches.first else { return }
        endPoint = touch.location(in: self)
    }

    override func draw(_ rect: CGRect) {
        let rectangle = CGRect(x: min(startPoint.x, endPoint.x), y: min(startPoint.y, endPoint.y),
                               width: abs(startPoint.x - endPoint.x), height: abs(startPoint.y - endPoint.y))

        let roundedRectangle = UIBezierPath(roundedRect: rectangle, cornerRadius: 3.5)
        roundedRectangle.lineWidth = 2.5

        UIColor.clear.setFill()
        UIColor.red.setStroke()

        roundedRectangle.stroke()
    }
}
```
_<sup>Check out the complete code for this at [github/rational-kunal/Picaso/CanvasView.swift](https://github.com/rational-kunal/Picaso/blob/main/Sources/Draw/CanvasManager.swift)</sup>_

With this, we have the following output

![Dragging inside the running app to draw a highlight rectangle over part of the screen.](/writing/lets-highlight/01b1803c.gif)

## Lets over-engineer
As further improvements, I implemented a way to resize the rectangle by dragging corners. To achieve this, we need to manage each corner and the selection state of the rectangle. I finally packaged this in a swift package for anyone who wants to check out the functionality with a quick setup.


![Resizing an already-drawn rectangle by dragging one of its corner handles.](/writing/lets-highlight/648e261c.gif)

Final comparison of before and after workflow of taking screenshots

| Before   | After |
|------------|----------|-----------|
| ![Image description](/writing/lets-highlight/e22b8c71.gif)| ![Image description](/writing/lets-highlight/4b65c6ff.gif) |

With this, 1) improved productivity by removing the need to edit screenshots and 2) Learn a few new things like `UIPhysicalKeyboardEvent.` Please check out the complete plugin at [github/rational-kunal/Draw](https://github.com/rational-kunal/Draw), and leave a star if you liked it.

Thank you for reading.
