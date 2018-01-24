import * as ErrorHandler from 'errorhandler'
import { ServiceProvider } from '../support/serviceprovider'

/**
 * Development Service Provider
 */
export class ErrorHandlerServiceProvider extends ServiceProvider {
  /**
   * Register the service provider
   */
  register (): void {
    const options: ErrorHandler.Options = this.edmunds.config.has('development.errorhandler')
      ? this.edmunds.config.get('development.errorhandler')
      : undefined

    const handler = ErrorHandler(options)
    this.edmunds.app.use(handler)
  }
}
