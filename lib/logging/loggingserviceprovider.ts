import {
  Logger,
  TransportInstance
} from 'winston'
import { ServiceProvider } from '../support/serviceprovider'
import { LoggingManager } from './loggingmanager'

export class LoggingServiceProvider extends ServiceProvider {
  /**
   * Register the service provider
   */
  register (): void {
    if (!this.edmunds.config.has('logging.enabled')
        || !this.edmunds.config.get('logging.enabled')) {
      return
    }

    let transports: TransportInstance[] = []
    if (this.edmunds.config.has('logging.instances')) {
      const instances: any[] = this.edmunds.config.get('logging.instances')
      const manager = new LoggingManager(this.edmunds, instances)
      const managerAll: any = manager.all()
      transports = Object.keys(managerAll).map(key => managerAll[key])
    }

    this.edmunds.logger = new Logger({
      transports
    })
  }
}
