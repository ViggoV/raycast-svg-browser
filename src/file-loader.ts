import fs from 'fs/promises'
import path from 'path'
import { homedir } from 'os'
import { getPreferenceValues } from '@raycast/api'

interface Preferences {
  svgFolderPath: string
}

export interface FileInfo {
  name: string
  fullPath: string
  parentFolder: string
}

export type GroupedFiles = Record<string, FileInfo[]>

export async function loadFiles(): Promise<{
  files: GroupedFiles
  resolvedPath: string
}> {
  const preferences = getPreferenceValues<Preferences>()
  let resolvedPath = preferences.svgFolderPath

  if (!resolvedPath) {
    throw new Error('SVG folder path is not configured in preferences.')
  }

  if (resolvedPath.startsWith('~')) {
    resolvedPath = path.join(homedir(), resolvedPath.slice(1))
  }

  const filesMap: GroupedFiles = {}
  const rootFolderName = '.'

  const dirEntries = await fs.readdir(resolvedPath, { withFileTypes: true })

  const subdirs: string[] = []
  for (const entry of dirEntries) {
    const entryPath = path.join(resolvedPath, entry.name)
    if (entry.isFile() && entry.name.toLowerCase().endsWith('.svg')) {
      if (!filesMap[rootFolderName]) filesMap[rootFolderName] = []
      filesMap[rootFolderName].push({
        name: entry.name,
        fullPath: entryPath,
        parentFolder: rootFolderName,
      })
    } else if (entry.isDirectory()) {
      subdirs.push(entry.name)
    }
  }

  for (const subdirName of subdirs) {
    const subdirPath = path.join(resolvedPath, subdirName)
    try {
      const subdirEntries = await fs.readdir(subdirPath, {
        withFileTypes: true,
      })
      for (const entry of subdirEntries) {
        if (entry.isFile() && entry.name.toLowerCase().endsWith('.svg')) {
          const entryPath = path.join(subdirPath, entry.name)
          if (!filesMap[subdirName]) filesMap[subdirName] = []
          filesMap[subdirName].push({
            name: entry.name,
            fullPath: entryPath,
            parentFolder: subdirName,
          })
        }
      }
    } catch (subErr) {
      console.warn(`Could not read subdirectory: ${subdirPath}`, subErr)
    }
  }

  return { files: filesMap, resolvedPath }
}
