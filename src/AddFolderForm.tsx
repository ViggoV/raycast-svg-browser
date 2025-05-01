import React from 'react'
import {
  Form,
  ActionPanel,
  Action,
  useNavigation,
  showToast,
  Toast,
} from '@raycast/api'
import { FolderEntry } from './manageSVGFolders' // Assuming FolderEntry is exported

interface AddFolderFormProps {
  onSubmit: (path: string, originalId?: string) => void // Updated callback for add/edit
  folderToEdit?: FolderEntry // Optional existing folder data for editing
}

export default function AddFolderForm(
  props: AddFolderFormProps,
): React.JSX.Element {
  const { pop } = useNavigation()

  async function handleSubmit(values: { folderPath: string }) {
    const { folderPath } = values

    if (!folderPath?.trim()) {
      await showToast({
        style: Toast.Style.Failure,
        title: 'Validation Error',
        message: 'Folder path cannot be empty.',
      })
      return
    }

    props.onSubmit(folderPath.trim(), props.folderToEdit?.id)

    await showToast({
      style: Toast.Style.Success,
      title: props.folderToEdit ? 'Changes Saved' : 'Folder Added',
      message: folderPath.trim(),
    })
    pop()
  }

  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm
            title={props.folderToEdit ? 'Save Changes' : 'Add Folder'}
            onSubmit={handleSubmit}
          />
        </ActionPanel>
      }
    >
      <Form.TextField
        id="folderPath"
        title="Folder Path"
        placeholder="Enter path to SVG folder (e.g., ~/Assets/Icons)"
        defaultValue={props.folderToEdit?.path}
      />
    </Form>
  )
}
