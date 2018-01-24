import * as MethodOverride from 'method-override'
import { ServiceProvider } from '../support/serviceprovider'

/**
 * Method Override Service Provider
 */
export class MethodOverrideServiceProvider extends ServiceProvider {
  /**
   * Register the service provider
   */
  register (): void {
    const getter: string = this.edmunds.config.get('methodoverride.getter')
    const options: MethodOverride.MethodOverrideOptions = this.edmunds.config.has('methodoverride.options')
      ? this.edmunds.config.get('methodoverride.options')
      : undefined

    const override = MethodOverride(getter, options)
    this.edmunds.app.use(override)
  }
}
