import SyncManager from '../support/syncmanager'

export default class LoggingManager extends SyncManager<any> {
  /**
   * Create Winston transporter
   * @param {any} config
   * @returns {winston.TransportInstance}
   */
  protected createDriver (config: any): any {
    const driver: string = config.driver

    if (driver === 'RawConsole') {
      const { RawConsole } = require('./drivers/rawconsole')
      return new RawConsole(config)
    }

    const { transports } = require('winston')
    let driverClass: new (config: any) => any = (transports as any)[driver]
    if (driverClass) {
      return new driverClass(config)
    }

    throw Error(`Driver "${driver}" could not be found for winston. Is the transporter installed?`)
  }

  /**
   * Resolve the create method name
   * @param {string} driver
   * @returns {string}
   */
  protected resolveCreateMethodName (driver: string): string {
    return 'createDriver'
  }
}
