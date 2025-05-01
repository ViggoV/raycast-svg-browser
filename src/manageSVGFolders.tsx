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
import fs from 'fs/promises'
import path from 'path'
import { homedir } from 'os'

export interface FolderEntry {
  id: string
  path: string
}

export const STORAGE_KEY = 'configuredSvgFolders'

export interface ValidationStatusInfo {
  key:
    | 'valid'
    | 'invalid_format'
    | 'not_found'
    | 'not_directory'
    | 'permission_denied'
    | 'unknown_error'
  message?: string
  severity: 'error' | 'warning' | 'info' | 'success'
}

export default function ManageSVGFoldersCommand(): React.JSX.Element {
  const [folders, setFolders] = useState<FolderEntry[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [validationStatus, setValidationStatus] = useState<
    Map<string, ValidationStatusInfo>
  >(new Map<string, ValidationStatusInfo>())
  const { push } = useNavigation()

  useEffect(() => {
    async function loadAndValidateFolders() {
      setIsLoading(true)
      try {
        const storedFolders = await LocalStorage.getItem<string>(STORAGE_KEY)
        const loadedFolders: FolderEntry[] = storedFolders
          ? JSON.parse(storedFolders)
          : []
        setFolders(loadedFolders)

        // Validate folders after loading
        const newValidationStatus = new Map<string, ValidationStatusInfo>()
        for (const folder of loadedFolders) {
          const validationInfo = await validateFolderPath(folder.path)
          newValidationStatus.set(folder.id, validationInfo)
        }
        setValidationStatus(newValidationStatus)
      } catch (error) {
        console.error('Failed to load or validate folders:', error)
        await showToast({
          style: Toast.Style.Failure,
          title: 'Failed to Load Folders',
          message: error instanceof Error ? error.message : 'Unknown error',
        })
      } finally {
        setIsLoading(false)
      }
    }
    loadAndValidateFolders()
  }, [])

  async function handleAddFolder(path: string) {
    const newFolder: FolderEntry = {
      id: crypto.randomUUID(),
      path: path,
    }

    const originalFolders = folders
    const updatedFolders = [...folders, newFolder]
    setFolders(updatedFolders)

    // Validate the new folder path
    const validationInfo = await validateFolderPath(path)
    setValidationStatus((prevStatus) => {
      const newStatus = new Map(prevStatus)
      newStatus.set(newFolder.id, validationInfo)
      return newStatus
    })

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

    // Remove validation status for the deleted folder
    setValidationStatus((prevStatus) => {
      const newStatus = new Map(prevStatus)
      newStatus.delete(folderId)
      return newStatus
    })

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

    const originalFolders = [...folders] // Store original folders for revert
    const originalValidationStatus = new Map(validationStatus) // Store original validation status for revert

    const updatedFolders = folders.map((folder) => {
      if (folder.id === originalId) {
        return { ...folder, path: newPath }
      }
      return folder
    })

    setFolders(updatedFolders)

    // Validate the edited folder path
    const validationInfo = await validateFolderPath(newPath) // Changed variable name
    setValidationStatus((prevStatus) => {
      const newStatus = new Map(prevStatus)
      newStatus.set(originalId, validationInfo) // Changed value being set
      return newStatus
    })

    try {
      await LocalStorage.setItem(STORAGE_KEY, JSON.stringify(updatedFolders))
    } catch (error) {
      console.error('Failed to save edited folder:', error)
      setFolders(originalFolders) // Revert folders state
      setValidationStatus(originalValidationStatus) // Revert validation status state
      await showToast({
        style: Toast.Style.Failure,
        title: 'Failed to Save Changes',
        message: error instanceof Error ? error.message : 'Unknown error',
      })
    }
  }

  async function validateFolderPath(
    folderPath: string,
  ): Promise<ValidationStatusInfo> {
    let resolvedPath = folderPath
    if (resolvedPath.startsWith('~')) {
      resolvedPath = path.join(homedir(), resolvedPath.slice(1))
    }

    try {
      const stats = await fs.stat(resolvedPath)
      if (stats.isDirectory()) {
        return {
          key: 'valid',
          severity: 'success',
        }
      } else {
        return {
          key: 'not_directory',
          message: 'Path exists but is not a directory.',
          severity: 'error',
        }
      }
    } catch (error: any) {
      // Type assertion to any to access error.code
      console.error('Error validating path:', resolvedPath, error)
      if (error.code === 'ENOENT') {
        return {
          key: 'not_found',
          message: 'Path does not exist.',
          severity: 'error',
        }
      } else if (error.code === 'EACCES') {
        return {
          key: 'permission_denied',
          message: 'Permission denied to access the path.',
          severity: 'error',
        }
      } else {
        return {
          key: 'unknown_error',
          message: `An unknown error occurred: ${error.message}`,
          severity: 'error',
        }
      }
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
        folders.map((folder) => {
          const status = validationStatus.get(folder.id)
          const isInvalid = status?.key !== 'valid'
          return (
            <List.Item
              key={folder.id}
              title={folder.path}
              icon={
                isInvalid
                  ? { source: Icon.Warning, tintColor: 'red' }
                  : Icon.Folder
              }
              accessories={
                isInvalid
                  ? [
                      {
                        tooltip: status?.message ?? 'Invalid path',
                        text: status?.message ?? 'Invalid', // Display message as text
                      },
                    ]
                  : []
              }
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
          )
        })
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
