import ServiceProvider from '../support/serviceprovider'
import LoggingManager from './loggingmanager'

export default class LoggingServiceProvider extends ServiceProvider {
  /**
   * Register the service provider
   */
  register (): void {
    const { createLogger } = require('winston')

    let instances: any[] = []
    if (this.edmunds.config.has('logging.instance')) {
      instances = [this.edmunds.config.get('logging.instance')]
    } else if (this.edmunds.config.has('logging.instances')) {
      instances = this.edmunds.config.get('logging.instances')
    }

    // Load all transports
    let transports: any[] = []
    if (instances.length) {
      const manager = new LoggingManager(this.edmunds, instances)
      const managerAll: any = manager.all()
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
