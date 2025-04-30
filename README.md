# Raycast SVG Browser

A Raycast extension to quickly browse and interact with SVG files stored in a designated folder and its immediate subdirectories.

## Features

*   Configure a folder containing your SVG assets via Raycast preferences.
*   Launch the "Browse SVGs" command to view your SVGs in a grid.
*   SVGs are grouped by their parent folder (root or immediate subfolder).
*   See visual previews of each SVG.
*   Perform actions on selected SVGs:
    *   **Copy File** (Primary Action): Copies the SVG file itself to the clipboard.
    *   **Copy Path** (`Cmd+Opt+P`): Copies the absolute file path.
    *   **Copy SVG Content** (`Cmd+Shift+C`): Copies the raw SVG markup.

## Development

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd raycast-svg-browser
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Start development mode:**
    ```bash
    npm run dev
    ```
    This will build the extension and watch for changes. Load the extension in Raycast by pointing it to the project directory.

## Contributing

Contributions are welcome! Please feel free to open an issue or submit a pull request if you have suggestions or improvements.
