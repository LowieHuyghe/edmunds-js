import {
  Logger,
  LoggerOptions,
  TransportInstance
} from 'winston'
import { ServiceProvider } from '../support/serviceprovider'
import { LoggingManager } from './loggingmanager'

export class LoggingServiceProvider extends ServiceProvider {
  /**
   * Register the service provider
   */
  register (): void {
    // Check if logging is enabled
    if (!this.edmunds.config.has('logging.enabled')
        || !this.edmunds.config.get('logging.enabled')) {
      return
    }

    // Load all transports
    let transports: TransportInstance[] = []
    if (this.edmunds.config.has('logging.instances')) {
      const instances: any[] = this.edmunds.config.get('logging.instances')
      const manager = new LoggingManager(this.edmunds, instances)
      const managerAll: any = manager.all()
      transports = Object.keys(managerAll).map(key => managerAll[key])
    }

    // Instantiate logger
    const loggerOptions: LoggerOptions = this.edmunds.config.has('logging.logger')
      ? this.edmunds.config.get('logging.logger')
      : {}
    this.edmunds.logger = new Logger({
      transports,
      ...loggerOptions
    })

    // Override console if wanted
    if (this.edmunds.config.has('logging.overrideConsole')
        && this.edmunds.config.get('logging.overrideConsole')) {
      console.log = (msg: any, ...args: any[]) => this.edmunds.logger.verbose(msg, ...args)
      console.info = (msg: any, ...args: any[]) => this.edmunds.logger.info(msg, ...args)
      console.warn = (msg: any, ...args: any[]) => this.edmunds.logger.warn(msg, ...args)
      console.error = (msg: any, ...args: any[]) => this.edmunds.logger.error(msg, ...args)
      console.debug = (msg: any, ...args: any[]) => this.edmunds.logger.debug(msg, ...args)
    }
  }
}
