import { Grid, Icon, ActionPanel, Action } from '@raycast/api'
import { useState, useEffect } from 'react'
import { loadFiles, GroupedFiles } from './file-loader'
import { readFileSync } from 'fs' // Import readFileSync

export default function Command() {
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [folderPath, setFolderPath] = useState<string | null>(null)
  const [groupedFiles, setGroupedFiles] = useState<GroupedFiles>({})

  useEffect(() => {
    async function loadData() {
      try {
        const { files: loadedFiles, resolvedPath } = await loadFiles()
        setGroupedFiles(loadedFiles)
        setFolderPath(resolvedPath)
      } catch (err: any) {
        console.error('Error loading files:', err)
        setError(err.message || 'Failed to load files.')
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
                        shortcut={{ modifiers: ['cmd', 'opt'], key: 'p' }} // Changed shortcut
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
              title="No SVG files found"
              description={`In folder: ${folderPath || ''}`}
            />
          )}
    </Grid>
  )
}
