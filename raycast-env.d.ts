/// <reference types="@raycast/api">

/* 🚧 🚧 🚧
 * This file is auto-generated from the extension's manifest.
 * Do not modify manually. Instead, update the `package.json` file.
 * 🚧 🚧 🚧 */

/* eslint-disable @typescript-eslint/ban-types */

type ExtensionPreferences = {
  /** SVG Folder Path - Path to the folder containing your SVG files (e.g., ~/Assets/Icons or /Users/me/Projects/MyProject/src/assets) */
  "svgFolderPath": string
}

/** Preferences accessible in all the extension's commands */
declare type Preferences = ExtensionPreferences

declare namespace Preferences {
  /** Preferences accessible in the `browseSVGs` command */
  export type BrowseSVGs = ExtensionPreferences & {}
}

declare namespace Arguments {
  /** Arguments passed to the `browseSVGs` command */
  export type BrowseSVGs = {}
}

