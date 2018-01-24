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
  }
}
