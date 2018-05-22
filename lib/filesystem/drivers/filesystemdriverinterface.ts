import * as stream from 'stream'

export default interface FileSystemDriverInterface {
  /**
   * Read a file
   * @param {string} sourcePath
   * @param options
   * @returns {Promise<void>}
   */
  read (sourcePath: string, options?: any): Promise<string>

  /**
   * Get a read stream
   * @param {string} sourcePath
   * @param {any} options
   * @returns {Promise<stream.Readable>}
   */
  readStream (sourcePath: string, options?: any): Promise<stream.Readable>

  /**
   * Write a file
   * @param {string} sourcePath
   * @param {string} content
   * @param options
   * @returns {Promise<void>}
   */
  write (sourcePath: string, content: string, options?: any): Promise<void>

  /**
   * Get a write stream
   * @param {string} sourcePath
   * @param {any} options
   * @returns {Promise<stream.Writable>}
   */
  writeStream (sourcePath: string, options?: any): Promise<stream.Writable>

  /**
   * Check if file exists
   * @param {string} sourcePath
   * @returns {Promise<boolean>}
   */
  exists (sourcePath: string): Promise<boolean>

  /**
   * Move a file
   * @param {string} sourcePath
   * @param {string} destinationPath
   * @returns {Promise<void>}
   */
  move (sourcePath: string, destinationPath: string): Promise<void>

  /**
   * Copy a file
   * @param {string} sourcePath
   * @param {string} destinationPath
   * @returns {Promise<void>}
   */
  copy (sourcePath: string, destinationPath: string): Promise<void>

  /**
   * Remove a file
   * @param {string} sourcePath
   * @returns {Promise<void>}
   */
  remove (sourcePath: string): Promise<void>

  /**
   * Get a processed file path
   * @param {string} sourcePath
   * @param {string} prefix
   * @returns {string}
   */
  path (sourcePath: string, prefix?: string): string
}
