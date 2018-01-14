import { Manager } from '../support/manager'
import {
  transports,
  TransportInstance
} from 'winston'

export class LoggingManager extends Manager {
  /**
   * Create Winston transporter
   * @param {any} config
   * @returns {winston.TransportInstance}
   */
  protected createDriver (config: any): TransportInstance {
    const driver: string = config.driver
    const driverClass: new (config: any) => TransportInstance = (transports as any)[driver]

    if (!driverClass) {
      throw Error(`Driver "${driver}" could not be found for winston. Is the transporter installed?`)
    }

    return new driverClass(config)
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
