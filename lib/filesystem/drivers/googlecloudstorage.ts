import DriverInterface from './filesystemdriverinterface'
import * as stream from 'stream'
import * as path from 'path'
import * as Storage from '@google-cloud/storage'

export default class GoogleCloudStorage implements DriverInterface {
  protected storage: Storage.Storage
  protected bucket: Storage.Bucket
  protected storagePath: string
  protected prefix: string | undefined

  /**
   * Constructor
   * @param {string} bucket
   * @param {string} storagePath
   * @param {string | undefined} prefix
   */
  constructor (bucket: string, storagePath: string, prefix?: string | undefined) {
    this.storage = Storage()
    this.bucket = this.storage.bucket(bucket)
    this.storagePath = storagePath
    this.prefix = prefix
  }

  /**
   * Read a file
   * @param {string} sourcePath
   * @param options
   * @returns {Promise<void>}
   */
  async read (sourcePath: string, options?: any): Promise<string> {
    const stream = await this.readStream(sourcePath, options)
    return new Promise<string>((resolve, reject) => {
      try {
        const chunks: string[] = []
        stream.on('data', (chunk: Buffer | string) => {
          chunks.push(chunk.toString())
        })
        stream.on('end', () => {
          resolve(chunks.join(''))
        })
        stream.on('error', reject)
      } catch (e) {
        reject(e)
      }
    })
  }

  /**
   * Get a read stream
   * @param {string} sourcePath
   * @param {any} options
   * @returns {Promise<stream.Readable>}
   */
  async readStream (sourcePath: string, options?: any): Promise<stream.Readable> {
    const processedSourcePath = this.path(sourcePath)
    const file = this.bucket.file(processedSourcePath)
    return file.createReadStream(options)
  }

  /**
   * Write a file
   * @param {string} sourcePath
   * @param {string} content
   * @param options
   * @returns {Promise<void>}
   */
  async write (sourcePath: string, content: string, options?: any): Promise<void> {
    const processedSourcePath = this.path(sourcePath)
    const file = this.bucket.file(processedSourcePath)
    return file.save(content)
  }

  /**
   * Get a write stream
   * @param {string} sourcePath
   * @param {any} options
   * @returns {Promise<stream.Writable>}
   */
  async writeStream (sourcePath: string, options?: any): Promise<stream.Writable> {
    const processedSourcePath = this.path(sourcePath)
    const file = this.bucket.file(processedSourcePath)
    return file.createWriteStream(options)
  }

  /**
   * Check if file exists
   * @param {string} sourcePath
   * @returns {Promise<boolean>}
   */
  async exists (sourcePath: string): Promise<boolean> {
    const processedSourcePath = this.path(sourcePath)
    const file = this.bucket.file(processedSourcePath)
    const exists = await file.exists()
    return exists[0]
  }

  /**
   * Move a file
   * @param {string} sourcePath
   * @param {string} destinationPath
   * @returns {Promise<void>}
   */
  async move (sourcePath: string, destinationPath: string): Promise<void> {
    const processedSourcePath = this.path(sourcePath)
    const processedDestinationPath = this.path(destinationPath)
    const file = this.bucket.file(processedSourcePath)
    return file.move(processedDestinationPath).then(() => undefined)
  }

  /**
   * Copy a file
   * @param {string} sourcePath
   * @param {string} destinationPath
   * @returns {Promise<void>}
   */
  async copy (sourcePath: string, destinationPath: string): Promise<void> {
    const processedSourcePath = this.path(sourcePath)
    const processedDestinationPath = this.path(destinationPath)
    const file = this.bucket.file(processedSourcePath)
    return file.copy(processedDestinationPath).then(() => undefined)
  }

  /**
   * Remove a file
   * @param {string} sourcePath
   * @returns {Promise<void>}
   */
  async remove (sourcePath: string): Promise<void> {
    const processedSourcePath = this.path(sourcePath)
    const file = this.bucket.file(processedSourcePath)
    return file.delete().then(() => undefined)
  }

  /**
   * Get a processed file path
   * @param {string} sourcePath
   * @param {string} prefix
   * @returns {string}
   */
  path (sourcePath: string, prefix?: string): string {
    if (!sourcePath) {
      return this.storagePath
    }

    const prefixToUse = prefix || this.prefix
    let sourcePathToUse = sourcePath.startsWith(path.sep) ? sourcePath : sourcePath.substr(1)

    if (prefixToUse) {
      const fileName = path.basename(sourcePath)

      if (!fileName.startsWith(prefixToUse)) {
        const dirPath = path.dirname(sourcePath)
        sourcePathToUse = path.join(dirPath, `${prefixToUse}${fileName}`)
      }
    }

    return path.join(this.storagePath, sourcePathToUse)
  }
}
