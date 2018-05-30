import Manager from '../support/manager'
import FileSystemDriverInterface from '../foundation/filesystemdriverinterface'

export default class FileSystemManager extends Manager<FileSystemDriverInterface> {
  /**
   * Create local driver
   * @param {any} config
   * @returns {Local}
   */
  protected createLocal (config: any): FileSystemDriverInterface {
    const { default: Local } = require('./drivers/local')

    const rootPath = this.edmunds.root
    const storagePath = config.path
    const prefix = config.prefix

    if (!storagePath) {
      throw new Error(`'path'-config is missing for filesystem-instance '${config.name}'`)
    }

    return new Local(rootPath, storagePath, prefix)
  }

  /**
   * Create google cloud storage driver
   * @param {any} config
   * @returns {GoogleCloudStorage}
   */
  protected createGooglecloudstorage (config: any): FileSystemDriverInterface {
    const { default: GoogleCloudStorage } = require('./drivers/googlecloudstorage')

    const bucket = config.bucket
    const storagePath = config.path
    const prefix = config.prefix

    if (!bucket) {
      throw new Error(`'bucket'-config is missing for filesystem-instance '${config.name}'`)
    }

    return new GoogleCloudStorage(bucket, storagePath, prefix)
  }
}
