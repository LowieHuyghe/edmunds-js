import Manager from '../support/manager'
import {
  createConnection,
  ConnectionOptions,
  Connection
} from 'typeorm'

export default class DatabaseManager extends Manager<Connection> {
  /**
   * Create database connection
   * @param {ConnectionOptions} config
   * @returns {Promise<Connection>}
   */
  protected createConnection (config: ConnectionOptions): Promise<Connection> {
    return createConnection(config)
  }

  /**
   * Destroy connection
   * @param {ConnectionOptions} config
   * @param {Connection} instance
   */
  protected destroyConnection (config: ConnectionOptions, instance: Connection): Promise<void> {
    return instance.close()
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
