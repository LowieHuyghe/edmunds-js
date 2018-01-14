import * as express from 'express'
import { ServiceProvider } from './support/serviceprovider'
import { isUndefined } from 'util'
import * as config from 'config'
import { LoggerInstance } from 'winston'

/**
 * Edmunds class
 */
export class Edmunds {
  /**
   * {Express}
   */
  public app: express.Express

  /**
   * Config
   */
  public config: config.IConfig

  /**
   * Logger
   */
  public logger: LoggerInstance

  /**
   * Constructor
   */
  constructor (app?: express.Express) {
    this.app = isUndefined(app) ? express() : app
    this.app.set('edmunds', this)

    this.config = config
  }

  /**
   * Register a service provider
   * @param {{new(edmunds: Edmunds): ServiceProvider}} GivenServiceProvider
   */
  register (GivenServiceProvider: new (app: Edmunds) => ServiceProvider) {
    const instance = new GivenServiceProvider(this)
    instance.register()
  }
}
