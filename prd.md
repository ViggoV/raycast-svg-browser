# Product Requirements Document: Raycast SVG Browser

## 1. Introduction

This document outlines the requirements for a Raycast extension designed to browse Scalable Vector Graphics (SVG) files located within a user-specified folder. The primary goal is to provide a quick and efficient way for users (designers, developers, etc.) to find and view SVG assets directly from Raycast.

## 2. Goals

*   Allow users to configure a specific folder containing SVG files.
*   Provide a Raycast command to list all SVG files within the configured folder **and its immediate subfolders (one level deep)**.
*   Display a preview or thumbnail of each SVG file in the list.
*   Enable users to quickly perform basic actions on a selected SVG, with the primary action being copying the file itself.
*   Offer a fast and responsive browsing experience.

## 3. Non-Goals

*   Editing SVG files within the extension.
*   Advanced search or filtering capabilities (beyond simple listing).
*   Support for browsing multiple folders simultaneously in the initial version.
*   Integration with specific design tools.
*   Managing SVG libraries or collections.

## 4. User Stories

*   As a developer, I want to quickly find an SVG icon in my project's asset folder using Raycast so I can copy the file to paste it into another folder or application.
*   As a designer, I want to browse through my SVG icon set folder in Raycast to visually identify the icon I need and copy the file for use in my design software.
*   As a user, I want to configure the extension to point to my main SVG assets folder so I don't have to navigate to it manually each time.
*   As a user, I want to be able to copy the raw SVG code or the file path of an icon directly from Raycast as secondary actions.

## 5. Requirements

### 5.1 Functional Requirements

*   **FR1:** The extension must provide a setting or command to specify the target folder path containing SVG files.
*   **FR2:** A Raycast command must be available to trigger the SVG browser.
*   **FR3:** Upon activation, the command should list all files with the `.svg` extension found in the configured folder **and its immediate subfolders (one level deep only)**. Deeper subfolders should be ignored.
*   **FR4:** The list should display the filename of each SVG. **SVGs should be displayed in a Grid view, grouped by their parent folder (the root configured folder or the immediate subfolder). The folder name should serve as the section title.**
*   **FR5:** The list **grid** should display a visual preview/thumbnail for each SVG file.
*   **FR6:** Selecting an SVG file in the **grid** should present actions, with copying the file being the default/primary action (e.g., triggered by Enter key).
*   **FR7:** An action must be available to copy the selected SVG file to the system clipboard.
*   **FR8:** A secondary action must be available to copy the absolute file path of the selected SVG to the clipboard.
*   **FR9:** A secondary action must be available to copy the text content (the raw SVG markup) of the selected SVG to the clipboard.

### 5.2 Non-Functional Requirements

*   **NFR1:** Performance: Listing and previewing SVGs should be fast, even for folders with a moderate number of files (e.g., < 500).
*   **NFR2:** Usability: The Raycast command and interface should be intuitive and follow Raycast's design conventions.
*   **NFR3:** Reliability: The extension should handle potential errors gracefully (e.g., folder not found, invalid SVGs for preview).
*   **NFR4:** Configuration: The folder path configuration should be persistent.
*   **NFR5:** Code Style: The codebase must adhere to the defined ESLint and Prettier configurations for consistency and maintainability.

## 6. Design

*(Initial thoughts: Utilize Raycast's built-in **Grid** view. SVGs will be grouped into sections based on their parent folder (root or immediate subfolder), with the folder name as the section title. Previews will be the primary content of each grid item. Actions will be available via Raycast's Action Panel, with 'Copy File' as the primary action. The existing Heroicons Raycast extension can serve as a good source of inspiration for UI/UX and functionality.)*

## 7. Open Questions

*   How should the initial folder path be configured? (Preference panel, first-run prompt?)
*   What is the best way to generate SVG previews efficiently within Raycast's limitations?
*   ~~Should subfolders within the target folder be scanned recursively?~~ (Decision: One level deep only)
*   ~~How should files from immediate subfolders be displayed in the list to avoid name collisions and provide context?~~ (Decision: **Grouped by folder name in a Grid view**)
*   What other actions might be useful (e.g., Open in Finder, Open with default app)?

## 8. Future Considerations

*   Support for multiple folders or project-based folder detection.
*   Search/filtering functionality.
*   Different view modes (e.g., grid view).
*   Customizable actions.
*   Displaying SVG metadata (dimensions, etc.).
