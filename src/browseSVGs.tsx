import React, { useState, useEffect } from 'react'
import { Grid, Icon, ActionPanel, Action, LocalStorage } from '@raycast/api'
import { loadFiles, GroupedFiles } from './file-loader'
import { readFileSync } from 'fs'
import { FolderEntry, STORAGE_KEY } from './manageSVGFolders'

export default function Command(): React.JSX.Element {
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [groupedFiles, setGroupedFiles] = useState<GroupedFiles>({})
  const [folders, setFolders] = useState<FolderEntry[]>([])

  useEffect(() => {
    async function loadData() {
      setIsLoading(true)
      setError(null) // Reset error state
      try {
        const storedFolders = await LocalStorage.getItem<string>(STORAGE_KEY)
        const loadedFolders: FolderEntry[] = storedFolders
          ? JSON.parse(storedFolders)
          : []
        setFolders(loadedFolders)

        if (loadedFolders.length > 0) {
          const folderPaths = loadedFolders.map((folder) => folder.path)
          const { files: loadedFiles } = await loadFiles(folderPaths)
          setGroupedFiles(loadedFiles)
        } else {
          setGroupedFiles({}) // Clear files if no folders are configured
        }

        // Remove setFolderPath call
      } catch (err: any) {
        console.error('Error loading data:', err)
        setError(err.message || 'Failed to load data.')
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  if (error) {
    return (
      <Grid isLoading={false}>
        <Grid.EmptyView icon={Icon.Warning} title="Error" description={error} />
      </Grid>
    )
  }

  return (
    <Grid isLoading={isLoading} columns={6} inset={Grid.Inset.Large}>
      {Object.entries(groupedFiles).length > 0
        ? Object.entries(groupedFiles).map(([folderName, files]) => (
            <Grid.Section
              key={folderName}
              title={folderName === '.' ? 'Root Folder' : folderName}
            >
              {files.map((file) => (
                <Grid.Item
                  key={file.fullPath}
                  title={file.name}
                  content={{ source: file.fullPath }}
                  actions={
                    <ActionPanel>
                      <Action.CopyToClipboard
                        title="Copy File"
                        content={{ file: file.fullPath }}
                      />
                      <Action.CopyToClipboard
                        title="Copy Path"
                        content={file.fullPath}
                        shortcut={{ modifiers: ['cmd', 'opt'], key: 'p' }}
                      />
                      <Action.CopyToClipboard
                        title="Copy SVG Content"
                        content={(() => {
                          try {
                            return readFileSync(file.fullPath, 'utf-8')
                          } catch (err) {
                            console.error('Failed to read SVG content:', err)
                            return 'Error reading file content'
                          }
                        })()}
                        shortcut={{ modifiers: ['cmd', 'shift'], key: 'c' }}
                      />
                    </ActionPanel>
                  }
                />
              ))}
            </Grid.Section>
          ))
        : !isLoading && (
            <Grid.EmptyView
              title={
                folders.length === 0
                  ? 'No Folders Configured'
                  : 'No SVG Files Found'
              }
              description={
                folders.length === 0
                  ? "Use the 'Manage SVG Folders' command to add folders."
                  : 'No SVG files were found in the configured folders.'
              }
              actions={
                folders.length === 0 ? (
                  <ActionPanel>
                    <Action.Open
                      title="Open Manage Folders"
                      target="raycast://extensions/ViggoV/svg-browser/manageSVGFolders"
                      application="Raycast"
                    />
                  </ActionPanel>
                ) : undefined
              }
            />
          )}
    </Grid>
  )
}
