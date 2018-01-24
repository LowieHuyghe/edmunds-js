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
   * Check if production
   * @returns {boolean}
   */
  isProduction (): boolean {
    return this.isEnv('prod')
  }

  /**
   * Check if staging
   * @returns {boolean}
   */
  isStaging (): boolean {
    return this.isEnv('stag')
  }

  /**
   * Check if development
   * @returns {boolean}
   */
  isDevelopment (): boolean {
    return this.isEnv('dev')
  }

  /**
   * Check if testing
   * @returns {boolean}
   */
  isTesting (): boolean {
    return this.isEnv('test')
  }

  /**
   * Register a service provider
   * @param {{new(edmunds: Edmunds): ServiceProvider}} GivenServiceProvider
   */
  async register (GivenServiceProvider: new (app: Edmunds) => ServiceProvider): Promise<void> {
    const instance = new GivenServiceProvider(this)
    await instance.register()
  }

  /**
   * Is environment
   * @param {string} env Given environment to check
   * @returns {boolean}
   */
  protected isEnv (env: string): boolean {
    return this.app.get('env').toLowerCase().indexOf(env.toLowerCase()) === 0
  }
}
