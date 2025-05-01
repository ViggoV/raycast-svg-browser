import { loadFiles } from '../src/file-loader'
import { getPreferenceValues } from '@raycast/api'
import fs from 'fs/promises'
import os from 'os'

// Mock fs/promises and os
jest.mock('fs/promises')
jest.mock('os')

const mockedGetPreferenceValues = getPreferenceValues as jest.MockedFunction<
  typeof getPreferenceValues
>
// Create typed mocks for fs and os
const mockedFs = fs as jest.Mocked<typeof fs>
const mockedOs = os as jest.Mocked<typeof os>

describe('loadFiles', () => {
  beforeEach(() => {
    mockedGetPreferenceValues.mockClear()
    mockedFs.readdir.mockClear()
    mockedOs.homedir.mockClear()
  })

  it('should throw an error if svgFolderPath preference is missing', async () => {
    mockedGetPreferenceValues.mockReturnValue({})

    // Act & Assert: Expect loadFiles to reject with the correct error message
    await expect(loadFiles()).rejects.toThrow(
      'SVG folder path is not configured in preferences.', // Updated expected error message
    )
  })

  it('should resolve paths starting with ~ to the home directory', async () => {
    // Arrange
    const mockHomeDir = '/mock/home'
    const preferencePath = '~/svgs'
    const expectedResolvedPath = '/mock/home/svgs'

    mockedGetPreferenceValues.mockReturnValue({ svgFolderPath: preferencePath })
    mockedOs.homedir.mockReturnValue(mockHomeDir)
    // Mock readdir to prevent errors, return empty array as we only test path resolution here
    mockedFs.readdir.mockResolvedValue([])

    // Act
    const { resolvedPath } = await loadFiles()

    // Assert
    expect(resolvedPath).toBe(expectedResolvedPath)
    // Verify readdir was called with the resolved path
    expect(mockedFs.readdir).toHaveBeenCalledWith(expectedResolvedPath, {
      withFileTypes: true,
    })
  })

  it('should use absolute paths directly without modification', async () => {
    // Arrange
    const absolutePath = '/Users/test/svgs'
    mockedGetPreferenceValues.mockReturnValue({ svgFolderPath: absolutePath })
    // Mock readdir to prevent errors, return empty array as we only test path usage
    mockedFs.readdir.mockResolvedValue([])

    // Act
    const { resolvedPath } = await loadFiles()

    // Assert
    expect(resolvedPath).toBe(absolutePath)
    // Verify readdir was called with the absolute path
    expect(mockedFs.readdir).toHaveBeenCalledWith(absolutePath, {
      withFileTypes: true,
    })
    // Verify homedir was not called for absolute paths
    expect(mockedOs.homedir).not.toHaveBeenCalled()
  })

  it('should throw an error if the resolved path does not exist', async () => {
    // Arrange
    const nonExistentPath = '/path/does/not/exist'
    mockedGetPreferenceValues.mockReturnValue({
      svgFolderPath: nonExistentPath,
    })

    // Simulate fs.readdir throwing an ENOENT error
    const fsError = new Error('ENOENT: no such file or directory')
    ;(fsError as any).code = 'ENOENT' // Keep the type assertion for now
    mockedFs.readdir.mockRejectedValue(fsError)

    // Act & Assert
    // Expect the promise to reject. The exact error might change if we implement specific handling.
    await expect(loadFiles()).rejects.toThrow(
      'ENOENT: no such file or directory',
    )
  })
})
