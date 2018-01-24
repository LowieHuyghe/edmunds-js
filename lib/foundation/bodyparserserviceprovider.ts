import * as BodyParser from 'body-parser'
import { ServiceProvider } from '../support/serviceprovider'

/**
 * Development Service Provider
 */
export class BodyParserServiceProvider extends ServiceProvider {
  /**
   * Register the service provider
   */
  register (): void {
    const type: string = this.edmunds.config.get('bodyparser.type')
    const options: object = this.edmunds.config.has('bodyparser.options')
      ? this.edmunds.config.get('bodyparser.options')
      : undefined

    if (!(type in BodyParser)) {
      throw new Error(`"${type}" is not a valid body-parser-type`)
    }

    const parser = (BodyParser as any)[type](options)
    this.edmunds.app.use(parser)
  }
}
