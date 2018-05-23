import { Manager } from '../support/manager'
import Local from './drivers/local'
import GoogleCloudStorage from './drivers/googlecloudstorage'

export default class FileSystemManager extends Manager {
  /**
   * Create local driver
   * @param {any} config
   * @returns {Local}
   */
  protected createLocal (config: any): Local {
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
  protected createGooglecloudstorage (config: any): GoogleCloudStorage {
    const bucket = config.bucket
    const storagePath = config.path
    const prefix = config.prefix

    if (!bucket || !storagePath) {
      throw new Error(`'bucket'- or 'path'-config is missing for filesystem-instance '${config.name}'`)
    }

    return new GoogleCloudStorage(bucket, storagePath, prefix)
  }
}
