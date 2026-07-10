# CHATGPT.README.md

## Project

**Arcade** is a React + TypeScript application targeting:

* Android TV
* Android Mobile (later via Capacitor)
* Web Browser

The primary target is **Android TV**.

This project is for learning game development while building a collection of retro arcade games.

---

# Tech Stack

* React 19
* TypeScript
* Vite
* React Router
* SCSS
* HTML5 Canvas
* Capacitor (later for APK)

Do **not** introduce React Native or a game engine (Phaser, Pixi, Unity, etc.).

The goal is to learn how a game engine works by implementing one ourselves.

---

# Overall Architecture

React is responsible for:

* Routing
* Menus
* Navigation
* Settings
* Game selection
* Pause screens
* Game over screens

Canvas is responsible for:

* Rendering
* Animation
* Game loop
* Collision
* Physics
* Enemy spawning
* Score
* Fuel
* Movement

Never use React state for per-frame rendering.

Correct architecture:

```
React
    ↓

RoadFighterPage

    ↓

Canvas

    ↓

Game Engine

    ↓

requestAnimationFrame()
```

---

# Initial Games

Current:

* Road Fighter

Future:

* Snake
* Tetris
* Brick Breaker
* Chess Puzzle

The Arcade page should be generic enough to host multiple games.

---

# Navigation Flow

```
Home

↓

Arcade

↓

Road Fighter

↓

Start Screen

↓

Game

↓

Game Over
```

---

# Road Fighter MVP

## Phase 1

* Infinite scrolling road
* Player car
* Left / Right movement
* Start screen

No enemies.

No score.

No fuel.

---

## Phase 2

Add:

* Enemy cars
* Collision detection
* Fuel
* Score
* Increasing difficulty

---

# Controls

The application targets TV remotes.

Primary controls:

* Arrow Left
* Arrow Right
* Arrow Up
* Arrow Down
* Enter
* Back / Escape

Mouse support is **not required**.

---

# Focus System

Implement a custom focus manager.

Avoid relying on browser focus.

Architecture:

```
FocusProvider
    ↓

FocusScope

    ↓

Focusable
```

Each screen owns its own focus scope.

Focusable items define their neighbours.

Example:

```
START ←→ EXIT
```

or

```
PLAY
 ↓
SETTINGS
 ↓
EXIT
```

The focus manager should support:

* initial focus
* moving focus
* remembering previous focus
* Enter action
* future modal support

---

# Rendering

Canvas should render:

* road
* player
* enemies
* fuel
* score

React should never render these every frame.

Use requestAnimationFrame.

---

# Styling

Use SCSS.

Folder structure:

```
styles/

    abstracts/
        _variables.scss
        _functions.scss
        _mixins.scss
        _typography.scss

    components/

    pages/
```

---

# Scaling

The design target is:

```
1920 × 1080
```

Support:

* 1280×720
* 1920×1080
* 3840×2160

Scaling is controlled through a CSS variable.

Example:

```
:root {
    --scale: 1;
}

@media (max-height: 720px) {
    :root {
        --scale: 0.6667;
}

@media (min-height: 2160px) {
    :root {
        --scale: 2;
}
```

SCSS helper:

```
tv(48)
```

returns

```
calc(48px * var(--scale))
```

Use this helper for:

* font sizes
* spacing
* padding
* margins
* border radius

---

# Typography

Maintain a centralized typography system.

Examples:

* Display
* Title
* Heading
* Body
* Caption

Do not hardcode font sizes inside components.

---

# Routing

Current routes:

```
/

Home

/arcade

Road Fighter list

/road-fighter

Road Fighter
```

Unknown routes redirect to Home.

---

# Folder Structure

```
src/

components/

focus/

game/
    engine/
    entities/
    scenes/
    systems/
    assets/

pages/
    home/
    arcade/
    road-fighter/

router/

styles/
```

---

# Game Engine

Keep all game logic inside `game/`.

Expected modules:

```
Game
Loop
Renderer
Input
Collision
Physics
Spawner
Score
Fuel
```

Game code should not depend on React.

---

# Coding Guidelines

* TypeScript only.
* Functional React components.
* Keep components small.
* Avoid unnecessary abstractions.
* Prefer composition over inheritance.
* Separate UI logic from game logic.
* Keep rendering deterministic.

---

# Browser Compatibility

The project should remain compatible with older Android TV browsers where practical.

Prefer:

* ES5-compatible runtime output when required
* appendChild instead of append
* avoid unnecessary modern browser APIs in shared runtime code

---

# Future Features

* Sound effects
* Background music
* High score
* Pause menu
* Multiple games
* Settings
* Save progress
* Android TV APK via Capacitor

---

# Project Philosophy

The goal is education first.

The codebase should prioritize:

1. Readability
2. Simple architecture
3. Learning game development fundamentals

Avoid over-engineering or introducing large frameworks unless there is a clear benefit.
