---
title: "Open document in \"Viewing\" mode"
description: "A small Chrome extension that opens Google Docs in viewing mode, so reading one stops being a way to edit it by accident."
published: 2024-05-26
tags: ["javascript", "extensions"]
readingTime: 2
devto: "https://dev.to/rationalkunal/open-document-in-viewing-mode-5ej1"
draft: false
---
Have you ever opened a Google Doc and while looking through it unknowingly updated it? This adds to unnecessary history to the doc. 
To prevent it one can just open the doc in "Viewing" mode. But there is [no option](https://support.google.com/docs/thread/10477369/how-to-open-google-doc-always-in-viewing-mode?hl=en) to open the doc in "Viewing" mode by default.

After some reverse engineering, I discovered that the "Viewing" mode button is always present in the DOM once it gets added after the delay. This insight led me to write a script that ensures your Google Docs always open in "Viewing" mode by default.

Script to **Open Google document in "Viewing" mode by default**
```js
;(async function () {
  // Some elements are not added to the DOM on initial load; one of such element is the menu containing "Viewing" mode.
  // Await till the mode switcher menu is added to the DOM.
  await new Promise(function (resolve) {
    var observer = new MutationObserver(function (mutations) {
      const targetContainerNode = document.querySelector('.docs-toolbar-mode-switcher-menu')
      if (!!targetContainerNode) {
        observer.disconnect()
        resolve()
        return
      }
    })

    // ".docs-toolbar-mode-switcher-menu" attaches on the body
    observer.observe(document.body, { childList: true })
  })

  const viewingModeButton = document.querySelector('.docs-toolbar-mode-switcher-viewing-menu-item')
  if (!viewingModeButton) {
    console.assert('[rational extension][doc mode] Unable to find mode buttons')
  }

  // Simulate click on viewing mode button
  simulateClick(viewingModeButton)
  console.count('[rational extension] Document mode be in "Viewing" mode')
})()

// For some reason the `HTMLElement.click()` method and just a `mousedown` event does not work here.
// To simulate click we need to fire `mousedown` followed by `mouseup` event
function simulateClick(onNode) {
  const createMouseEvent = (name) =>
    new MouseEvent(name, {
      view: window,
      bubbles: true,
      cancelable: true,
    })

  onNode.dispatchEvent(createMouseEvent('mousedown'))
  onNode.dispatchEvent(createMouseEvent('mouseup'))
}
```

Here is the output:
![Image description](/writing/open-documents-in-viewing-mode/db89fa7f.gif)

You can use this script with browser extensions like Tampermonkey. Personally, I'm compiling several such scripts into a custom extension for ease of use. Feel free to check out my project on GitHub: [Rational Chrome Extensions](https://github.com/rational-kunal/Rational-Chrome-Extensions).

Thank you for reading.
