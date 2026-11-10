---
title: "How to Parallax?"
description: "Layering two views inside a UIScrollView and moving them at different speeds, so the background lags behind the foreground."
published: 2023-04-29
tags: ["ios", "swift", "ux"]
readingTime: 2
devto: "https://dev.to/rationalkunal/how-to-parallax-1gh3"
draft: false
---
Let's see how to create a parallax effect in your app.

First, let's define what parallax is. Parallax scrolling is a popular design technique used to create a scrolling effect by moving multiple layers of content at different speeds. It's an effective way to add visual interest and depth to your app or website. You can achieve a similar effect with `UIScrollView`. In this blog post, we'll explore how to create a parallax effect using `UIScrollView`.

To create a parallax effect with `UIScrollView`, we'll use two parallax sub-views. We will adjust their position based on the scroll position of the `UIScrollView`.


![Two coloured sub-views sliding at different speeds as the scroll view is dragged.](/writing/how-to-parallax/6d918b85.gif)

### Step 1: Create the views

First, let's create our views programmatically and set up initial frames/constraints. We can do this in the `viewDidLoad()` method of our view controller.

```swift
class ViewController: UIViewController, UIScrollViewDelegate {

    let scrollView = UIScrollView()
    let contentView = UIView()
    let parallax1View = UIView()
    let parallax2View = UIView()
    let parallax3View = UIView()

    override func viewDidLoad() {
        super.viewDidLoad()

        scrollView.delegate = self
        scrollView.translatesAutoresizingMaskIntoConstraints = false
        view.addSubview(scrollView)

        contentView.translatesAutoresizingMaskIntoConstraints = false
        scrollView.addSubview(contentView)

        parallax1View.frame = CGRect(x: 0, y: 0, width: 200, height: 100)
        parallax1View.backgroundColor = .red
        parallax1View.clipsToBounds = true
        parallax1View.translatesAutoresizingMaskIntoConstraints = false
        contentView.addSubview(parallax1View)

        parallax2View.frame = CGRect(x: 100, y: 0, width: 200, height: 100)
        parallax2View.backgroundColor = .yellow
        parallax2View.clipsToBounds = true
        parallax2View.translatesAutoresizingMaskIntoConstraints = false
        contentView.addSubview(parallax2View)

        self.setUpConstraints()
    }

    func setUpConstraints() {
        NSLayoutConstraint.activate([
            // Scroll view
            scrollView.leadingAnchor.constraint(equalTo: view.leadingAnchor),
            scrollView.trailingAnchor.constraint(equalTo: view.trailingAnchor),
            scrollView.topAnchor.constraint(equalTo: view.topAnchor),
            scrollView.bottomAnchor.constraint(equalTo: view.bottomAnchor),

            // Content view
            contentView.leadingAnchor.constraint(equalTo: scrollView.leadingAnchor),
            contentView.trailingAnchor.constraint(equalTo: scrollView.trailingAnchor),
            contentView.topAnchor.constraint(equalTo: scrollView.topAnchor),
            contentView.bottomAnchor.constraint(equalTo: scrollView.bottomAnchor),
            contentView.widthAnchor.constraint(equalTo: scrollView.widthAnchor),
            contentView.heightAnchor.constraint(equalTo: scrollView.heightAnchor, multiplier: 2)
        ])
    }
}
```

In this code, we create the required views and set up constraints to position and size the views.

### Step 2: Adjust parallax sub-view positions

Next, we need to adjust the position of the `parallaxImageView` based on the scroll position of the `UIScrollView`. We can do this in the `scrollViewDidScroll(_:)` method of the `UIScrollViewDelegate` protocol.

```swift
extension ViewController {
    func scrollViewDidScroll(_ scrollView: UIScrollView) {
        let yContentOffest = scrollView.contentOffset.y
        let ySlowerOffset = yContentOffest / 2
        let yFasterOffset = 2 * yContentOffest
        parallax1View.frame.origin.y = -ySlowerOffset
        parallax2View.frame.origin.y = -yFasterOffset
    }
}
```

In this code, we calculate the vertical offset of the `UIScrollView` and adjust the position of the parallax view.

### Conclusion

In this blog, we learned how to create a very basic parallax effect using `UIScrollView`. We created two views, set up constraints, and adjusted their position based on the scroll position. Now you can use this technique to create stunning parallax effects in your own apps!
