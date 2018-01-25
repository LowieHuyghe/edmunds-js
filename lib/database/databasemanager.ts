import { Manager } from '../support/manager'
import { ConnectionOptions } from 'typeorm'

export class DatabaseManager extends Manager {
  /**
   * Create Connection Options
   * @param {any} config
   * @returns {ConnectionOptions}
   */
  protected createConnectionOptions (config: any): ConnectionOptions {
    return config as ConnectionOptions
  }

  /**
   * Resolve the driver key name
   * @returns {string}
   */
  protected resolveDriverKeyName () {
    return 'type'
  }

  /**
   * Resolve the create method name
   * @param {string} driver
   * @returns {string}
   */
  protected resolveCreateMethodName (driver: string): string {
    return 'createConnectionOptions'
  }
}
