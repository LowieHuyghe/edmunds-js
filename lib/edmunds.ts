import * as express from 'express'
import { ServiceProvider } from './support/serviceprovider'
import { isUndefined } from 'util'
import * as config from 'config'
import { LoggerInstance } from 'winston'
import { getConnection, Connection } from 'typeorm'
import 'reflect-metadata'

/**
 * Edmunds class
 */
export class Edmunds {
  /**
   * Root path
   */
  public root: string

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
   * @param {string} root The root path
   * @param {express.Express} app
   */
  constructor (root: string, app?: express.Express) {
    this.root = root
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
   * Get database connection
   * @param {string} name
   * @returns {Connection}
   */
  database (name?: string): Connection {
    return getConnection(name)
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
