---
title: "Building a Snake Game (on terminal with Swift)"
description: "A game loop, raw keyboard input and a redraw that does not flicker, written in Swift and running in a terminal window."
published: 2025-03-25
tags: ["ios", "swift", "terminal", "gamedev"]
readingTime: 2
devto: "https://dev.to/rationalkunal/building-a-snake-game-on-terminal-with-swift-57a2"
draft: false
---
> Please checkout the repository at https://github.com/rational-kunal/SSSnake

<img src="https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExcnF1M2Noemo2c2hoMzIwc3c5NmZoZzB3aWZ2c2FqaXN1am40OTFzZSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/OmblV5wb5fmiPu3RHj/giphy.gif" alt="A terminal window running swift run SSSnake, with the snake game playing inside it." width="480" height="380" loading="lazy" decoding="async" style="max-width:min(100%,300px);height:auto" />


## Basic terminal configuration

To create a smooth terminal-based game, we need to control the terminal behavior by: 1) Hiding the cursor to prevent flickering and 2) Enabling raw mode to capture key presses without requiring the user to hit Enter.

```swift
static func hideCursor() {
    print("\u{001B}[?25l", terminator: "")
}

static func enableRawMode() {
    var raw = termios()
    tcgetattr(STDIN_FILENO, &raw)
    raw.c_lflag &= ~tcflag_t(ECHO | ICANON)  // Disable echo & line buffering
    raw.c_cc.0 = 1  // Min character read
    raw.c_cc.1 = 0  // No timeout
    tcsetattr(STDIN_FILENO, TCSAFLUSH, &raw)
}
```

## Rendering the Game

The game is displayed using a 2D character array (canvas). To render a frame, we print this array.
Also, instead of printing each frame anew (which causes flickering), we move the cursor to the top and update the existing buffer.

```swift
struct Terminal {
    private(set) var canvas: [[Character]] = TerminalHelper.makeCanvas()

    // Renders the canvas / frame on the terminal
    mutating func render() {
        TerminalHelper.moveCursor(x: 0, y: 0)
        for row in canvas {
            print(String(row))
        }
        fflush(stdout)
    }

    // Draws the symbol at the given position
    mutating func draw(x: Int, y: Int, symbol: Character) {
        canvas[y][x] = symbol
    }
}
```

To compute the size of the canvas, i.e. terminal size, we can use the `ioctl` function.

```swift
private struct TerminalHelper {
    static func windowSize() -> (width: Int, height: Int) {
        var ws = winsize()
        _ = ioctl(STDOUT_FILENO, TIOCGWINSZ, &ws)
        return (Int(ws.ws_col), Int(ws.ws_row) - 1)
    }

    // Create blank 2d buffer of blank characters
    static func makeCanvas() -> [[Character]] {
        let (width, height) = windowSize()
        return Array(repeating: Array(repeating: " ", count: width), count: height)
    }
}
```

So now we have a way to render frames on the terminal.

## Get the user input

We need a non-blocking way to listen for user input. Running a background thread ensures that key presses are read continuously while the game logic runs separately.

```swift
DispatchQueue.global(qos: .userInteractive).async { [weak self] in
    while let self, self.isRunning, let key = Terminal.getKeyPress() {
        self.processInput(key)
    }
}

extension Terminal {
    static func getKeyPress() -> String? {
        var buffer = [UInt8](repeating: 0, count: 3)
        return read(STDIN_FILENO, &buffer, 3) == 1 ? String(UnicodeScalar(buffer[0])) : nil
    }
}
```


## Game loop

There should be a loop where we will ask the game to update its state and then update the canvas and then render it.

```swift
class Game {
    lazy var terminal = Terminal()

    public func start() {
        // Start the game loop
        while isRunning {
            terminal.update() // Refresh canvas
            loop() // Update game state
            draw() // Draw updated elements
            terminal.render() // Render the frame
            usleep(100_000) // Control game speed (10 FPS)
        }
    }

    func processInput(_ key: String) {}
    func loop() {}
    func draw() {}
}
```

Cool now we have a basic skeleton to build the game

## Snake game

Now, we can override the Game class to create our own Snake game.

```swift
class SnakeGame: Game {
    override func draw() {
        // Draw border, snake and its food
        // Like: terminal.at(x: 12, y: 33, symbol: "#")
    }

    override func loop() {
        // Update game state like move the snake spawn food if needed etc
    }

    override func processInput(_ key: String) {
        // Process inputs turn the direction of snke as needed
    }
}
```

Check out its implementation at [SnakeGame.swift](https://github.com/rational-kunal/SSSnake/blob/main/Sources/SnakeGame.swift)


Thanks for reading.


[https://github.com/rational-kunal](https://github.com/rational-kunal)
