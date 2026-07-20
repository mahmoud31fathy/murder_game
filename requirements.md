 # Product Requirements Specification: Single-Device Murder Mystery Game

## 1. Core Architecture & Game Mode
- **Platform Strategy:** Responsive Web Application (optimized for both Desktop and Mobile viewports).
- **Mode of Play:** **Pass-and-Play / Single-Device Hot-Seat Mode**. All players and the Host share a single physical screen/device during the session.

## 2. Player Mechanics & Dynamic Scaling
- **Dynamic Capacity:** Minimum **4 Players + 1 Host/Judge** (5 users total minimum). Scalable up to N players.
- **Role Allocation:**
  - **Host / Judge (The Moderator):** 
    - Has primary administrative view to initialize the room and control phase progression.
    - Manages secrecy: Discloses secret character identities to individual players privately (via screen-passing/reveal prompts).
    - Controls clue dispersion during active investigation phases.
  - **Players (Investigators / Suspects):** 
    - Assigned hidden character names, backstories, and secret objectives within the selected case.

## 3. Screen-Passing & Privacy Flow
Because all users operate on one physical screen, implement strict privacy mechanics:
- **Reveal Screen Pattern:** Provide "Pass screen to [Player Name / Host]" intermediate modal prompts.
- **Privacy Shield:** A "Tap to reveal / Tap to hide" button mechanism so players can read their secret roles/clues without revealing them to adjacent players.

## 4. Internationalization & Localization (Arabic Support)
- **Multi-language Architecture:** Full bilingual support (**Arabic** and **English**).
- **RTL Support:** Right-To-Left (`dir="rtl"`) layout adjustments when Arabic is selected.
- **Localized Content Schema:** Ensure case data, clues, character profiles, and standard UI components support dual-language strings.

## 5. Technical Directives for AI Agent
1. **State Management:** Maintain session state (current phase, active turn/player, revealed clues) cleanly in app state or local database.
2. **UI/UX Design:** Dark/Obsidian mystery theme with accessible, large-touch targets for mobile devices.
3. **i18n Readiness:** Wrap all UI text strings in translation hooks/utilities to allow seamless language switching.