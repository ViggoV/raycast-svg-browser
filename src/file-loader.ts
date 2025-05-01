import fs from 'fs/promises'
import path from 'path'
import { homedir } from 'os'

export interface FileInfo {
  name: string
  fullPath: string
  parentFolder: string
}

export type GroupedFiles = Record<string, FileInfo[]>

export async function loadFiles(folderPaths: string[]): Promise<{
  files: GroupedFiles
}> {
  const filesMap: GroupedFiles = {}

  for (const folderPath of folderPaths) {
    let resolvedPath = folderPath

    if (!resolvedPath) {
      console.warn('Skipping empty or invalid folder path.')
      continue
    }

    if (resolvedPath.startsWith('~')) {
      resolvedPath = path.join(homedir(), resolvedPath.slice(1))
    }

    const rootFolderName = path.basename(resolvedPath)

    try {
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
        const groupKey = `${rootFolderName}/${subdirName}`
        try {
          const subdirEntries = await fs.readdir(subdirPath, {
            withFileTypes: true,
          })
          for (const entry of subdirEntries) {
            if (entry.isFile() && entry.name.toLowerCase().endsWith('.svg')) {
              const entryPath = path.join(subdirPath, entry.name)
              if (!filesMap[groupKey]) filesMap[groupKey] = []
              filesMap[groupKey].push({
                name: entry.name,
                fullPath: entryPath,
                parentFolder: groupKey,
              })
            }
          }
        } catch (subErr) {
          console.warn(`Could not read subdirectory: ${subdirPath}`, subErr)
        }
      }
    } catch (dirErr) {
      console.warn(`Could not read directory: ${resolvedPath}`, dirErr)
    }
  }

  return { files: filesMap }
}
