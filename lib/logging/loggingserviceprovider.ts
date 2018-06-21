import ServiceProvider from '../support/serviceprovider'
import LoggingManager from './loggingmanager'

export default class LoggingServiceProvider extends ServiceProvider {
  /**
   * Register the service provider
   */
  async register (): Promise<void> {
    const { createLogger } = require('winston')

    // Load all transports
    let transports: any[] = []
    if (this.edmunds.config.has('logging.instances')) {
      const instances: any[] = this.edmunds.config.get('logging.instances')
      const manager = new LoggingManager(this.edmunds, instances)
      const managerAll: any = await manager.all()
      transports = Object.keys(managerAll).map(key => managerAll[key])
    }

    // Instantiate logger
    const loggerOptions = this.edmunds.config.has('logging.logger')
      ? this.edmunds.config.get('logging.logger')
      : {}
    this.edmunds.logger = createLogger({
      transports,
      ...loggerOptions
    })
  }
}
