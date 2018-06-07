import Manager from '../support/manager'

export default class DatabaseManager extends Manager<any> {
  /**
   * Create database connection
   * @param {ConnectionOptions} config
   * @returns {Promise<Connection>}
   */
  protected createConnection (config: any): Promise<any> {
    const { createConnection } = require('typeorm')
    return createConnection(config)
  }

  /**
   * Destroy connection
   * @param {ConnectionOptions} config
   * @param {Connection} instance
   */
  protected destroyConnection (config: any, instance: any): Promise<void> {
    return instance.close()
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
  protected resolveCreateMethodName (driver: string) {
    return 'createConnection'
  }

  /**
   * Resolve the destroy method name
   * @param {string} driver
   * @returns {string}
   */
  protected resolveDestroyMethodName (driver: string): string {
    return 'destroyConnection'
  }
}
