import DriverInterface from '../../edmunds/foundation/filesystemdriverinterface'
import * as fs from 'fs'
import * as util from 'util'
import * as stream from 'stream'
import * as path from 'path'
import * as mkdirp from 'mkdirp'

export default class Local implements DriverInterface {
  protected rootPath: string
  protected storagePath: string
  protected prefix: string | undefined

  /**
   * Constructor
   * @param {string} rootPath
   * @param {string} storagePath
   * @param {string | undefined} prefix
   */
  constructor (rootPath: string, storagePath: string, prefix?: string | undefined) {
    this.rootPath = rootPath
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
    const processedSourcePath = this.path(sourcePath)
    return util.promisify(fs.readFile)(processedSourcePath, options).then(buffer => buffer.toString())
  }

  /**
   * Get a read stream
   * @param {string} sourcePath
   * @param {any} options
   * @returns {Promise<stream.Readable>}
   */
  async readStream (sourcePath: string, options?: any): Promise<stream.Readable> {
    const processedSourcePath = this.path(sourcePath)
    return fs.createReadStream(processedSourcePath, options)
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
    await util.promisify(mkdirp)(path.dirname(processedSourcePath))
    return util.promisify(fs.writeFile)(processedSourcePath, content, options)
  }

  /**
   * Get a write stream
   * @param {string} sourcePath
   * @param {any} options
   * @returns {Promise<stream.Writable>}
   */
  async writeStream (sourcePath: string, options?: any): Promise<stream.Writable> {
    const processedSourcePath = this.path(sourcePath)
    await util.promisify(mkdirp)(path.dirname(processedSourcePath))
    return fs.createWriteStream(processedSourcePath, options)
  }

  /**
   * Check if file exists
   * @param {string} sourcePath
   * @returns {Promise<boolean>}
   */
  async exists (sourcePath: string): Promise<boolean> {
    const processedSourcePath = this.path(sourcePath)
    return fs.existsSync(processedSourcePath)
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
    await util.promisify(mkdirp)(path.dirname(processedDestinationPath))
    return util.promisify(fs.rename)(processedSourcePath, processedDestinationPath)
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
    await util.promisify(mkdirp)(path.dirname(processedDestinationPath))
    return util.promisify(fs.copyFile)(processedSourcePath, processedDestinationPath)
  }

  /**
   * Remove a file
   * @param {string} sourcePath
   * @returns {Promise<void>}
   */
  async remove (sourcePath: string): Promise<void> {
    const processedSourcePath = this.path(sourcePath)
    return util.promisify(fs.unlink)(processedSourcePath)
  }

  /**
   * Get a processed file path
   * @param {string|undefined} sourcePath
   * @param {string|undefined} prefix
   * @returns {string}
   */
  path (sourcePath?: string, prefix?: string): string {
    if (!sourcePath) {
      return path.join(this.rootPath, this.storagePath)
    }

    const prefixToUse = prefix || this.prefix
    let sourcePathToUse = sourcePath.startsWith(path.sep) ? sourcePath.substr(1) : sourcePath

    if (prefixToUse) {
      const fileName = path.basename(sourcePath)

      if (!fileName.startsWith(prefixToUse)) {
        const dirPath = path.dirname(sourcePath)
        sourcePathToUse = path.join(dirPath, `${prefixToUse}${fileName}`)
      }
    }

    return path.join(this.rootPath, this.storagePath, sourcePathToUse)
  }
}
