import React, { useState, useEffect } from 'react'
import {
  List,
  ActionPanel,
  Action,
  LocalStorage,
  useNavigation,
  showToast,
  Toast,
  Icon,
} from '@raycast/api'
import AddFolderForm from './AddFolderForm'
import crypto from 'crypto'

export interface FolderEntry {
  id: string
  path: string
}

export const STORAGE_KEY = 'configuredSvgFolders'

export default function ManageSVGFoldersCommand(): React.JSX.Element {
  const [folders, setFolders] = useState<FolderEntry[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const { push } = useNavigation()

  useEffect(() => {
    async function loadFolders() {
      try {
        const storedFolders = await LocalStorage.getItem<string>(STORAGE_KEY)
        if (storedFolders) {
          setFolders(JSON.parse(storedFolders))
        }
      } catch (error) {
        console.error('Failed to load folders:', error)
        await showToast({
          style: Toast.Style.Failure,
          title: 'Failed to Load Folders',
          message: error instanceof Error ? error.message : 'Unknown error',
        })
      } finally {
        setIsLoading(false)
      }
    }
    loadFolders()
  }, [])

  async function handleAddFolder(path: string) {
    const newFolder: FolderEntry = {
      id: crypto.randomUUID(),
      path: path,
    }

    const originalFolders = folders
    const updatedFolders = [...folders, newFolder]
    setFolders(updatedFolders)

    try {
      await LocalStorage.setItem(STORAGE_KEY, JSON.stringify(updatedFolders))
    } catch (error) {
      console.error('Failed to save folder:', error)
      setFolders(originalFolders)
      await showToast({
        style: Toast.Style.Failure,
        title: 'Failed to Save Folder',
        message: error instanceof Error ? error.message : 'Unknown error',
      })
    }
  }

  async function handleRemoveFolder(folderId: string) {
    const originalFolders = folders
    const updatedFolders = folders.filter((folder) => folder.id !== folderId)
    setFolders(updatedFolders)

    try {
      await LocalStorage.setItem(STORAGE_KEY, JSON.stringify(updatedFolders))
    } catch (error) {
      console.error('Failed to remove folder:', error)
      setFolders(originalFolders)
      await showToast({
        style: Toast.Style.Failure,
        title: 'Failed to Remove Folder',
        message: error instanceof Error ? error.message : 'Unknown error',
      })
    }
  }

  async function handleEditFolder(newPath: string, originalId?: string) {
    if (!originalId) {
      console.error('handleEditFolder called without originalId')
      await showToast({
        style: Toast.Style.Failure,
        title: 'Error Saving Changes',
        message: 'Original folder ID was missing.',
      })
      return
    }

    const originalFolders = folders
    const updatedFolders = folders.map((folder) => {
      if (folder.id === originalId) {
        return { ...folder, path: newPath }
      }
      return folder
    })

    setFolders(updatedFolders)

    try {
      await LocalStorage.setItem(STORAGE_KEY, JSON.stringify(updatedFolders))
    } catch (error) {
      console.error('Failed to save edited folder:', error)
      setFolders(originalFolders)
      await showToast({
        style: Toast.Style.Failure,
        title: 'Failed to Save Changes',
        message: error instanceof Error ? error.message : 'Unknown error',
      })
    }
  }

  return (
    <List isLoading={isLoading}>
      {!isLoading && folders.length === 0 ? (
        <List.EmptyView
          title="No Folders Configured"
          description="Press ↵ to add your first SVG folder."
          actions={
            <ActionPanel>
              <Action
                title="Add Folder"
                onAction={() =>
                  push(<AddFolderForm onSubmit={handleAddFolder} />)
                }
              />
            </ActionPanel>
          }
        />
      ) : (
        folders.map((folder) => (
          <List.Item
            key={folder.id}
            title={folder.path}
            actions={
              <ActionPanel>
                <Action
                  title="Edit Folder"
                  icon={Icon.Pencil}
                  onAction={() =>
                    push(
                      <AddFolderForm
                        onSubmit={handleEditFolder}
                        folderToEdit={folder}
                      />,
                    )
                  }
                />
                <Action
                  title="Add Folder"
                  onAction={() =>
                    push(<AddFolderForm onSubmit={handleAddFolder} />)
                  }
                />
                <Action
                  title="Remove Folder"
                  style={Action.Style.Destructive}
                  onAction={() => handleRemoveFolder(folder.id)}
                />
              </ActionPanel>
            }
          />
        ))
      )}
      {/* Add static item for adding a new folder */}
      {!isLoading && (
        <List.Item
          key="add-new-folder"
          title="Add New Folder"
          icon={Icon.Plus}
          actions={
            <ActionPanel>
              <Action
                title="Add New Folder"
                onAction={() =>
                  push(<AddFolderForm onSubmit={handleAddFolder} />)
                }
              />
            </ActionPanel>
          }
        />
      )}
    </List>
  )
}
