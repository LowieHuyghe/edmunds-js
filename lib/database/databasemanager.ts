import { Manager } from '../support/manager'
import { ConnectionOptions } from 'typeorm'

export class DatabaseManager extends Manager {
  /**
   * Create Connection Options
   * @param {any} config
   * @returns {ConnectionOptions}
   */
  protected createConnectionOptions (config: any): ConnectionOptions {
    config.type = config.driver

    return config as ConnectionOptions
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
