import * as express from 'express'
import ServiceProvider from './support/serviceprovider'
import { IConfig } from 'config'
import 'reflect-metadata'
import FileSystemDriverInterface from './filesystem/drivers/filesystemdriverinterface'
import CacheDriverInterface from './cache/drivers/cachedriverinterface'
import ExitMiddleware from './support/exitmiddleware'
import SimplifiedLoggerInstanceInterface from './logging/simplifiedloggerinstanceinterface'

/**
 * Edmunds class
 */
export default class Edmunds {
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
  public config: IConfig

  /**
   * Logger
   */
  public logger: SimplifiedLoggerInstanceInterface

  /**
   * Constructor
   * @param {string} root The root path
   * @param {express.Express} app
   */
  constructor (root: string, app?: express.Express) {
    this.root = root
    this.app = app || express()
    this.app.set('edmunds', this)

    this.app.set('exiting', false)
    this.app.use(ExitMiddleware.func())

    this.config = require('config')
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
   * Get environment
   * @returns {string}
   */
  getEnvironment (): string {
    return this.app.get('env')
  }

  /**
   * Get database connection
   * @param {string} name
   * @returns {typeorm.Connection}
   */
  database (name?: string): Promise<any> {
    return this.app.get('edmunds-database-manager').get(name)
  }

  /**
   * Get cache instance
   * @param {string} name
   * @returns {CacheDriverInterface}
   */
  cache (name?: string): Promise<CacheDriverInterface> {
    return this.app.get('edmunds-cache-manager').get(name)
  }

  /**
   * Get file system instance
   * @param {string} name
   * @returns {FileSystemDriverInterface}
   */
  fileSystem (name?: string): Promise<FileSystemDriverInterface> {
    return this.app.get('edmunds-filesystem-manager').get(name)
  }

  /**
   * Register a service provider
   * @param {{new(edmunds: Edmunds): ServiceProvider}} GivenServiceProvider
   */
  register (GivenServiceProvider: new (app: Edmunds) => ServiceProvider): void {
    const instance = new GivenServiceProvider(this)
    instance.register()
  }

  /**
   * Register on exit listener
   * @param {() => void} listener
   */
  onExit (listener: () => void) {
    this.app.addListener('exit', listener)
  }

  /**
   * Exit the application gracefully
   */
  async exit (): Promise<void> {
    this.app.set('exiting', true)

    const listeners = this.app.listeners('exit')
    for (const listener of listeners) {
      await listener()
    }
  }

  /**
   * Check if application is exiting
   * @returns {boolean}
   */
  isExiting (): boolean {
    return this.app.get('exiting')
  }

  /**
   * Is environment
   * @param {string} env Given environment to check
   * @returns {boolean}
   */
  protected isEnv (env: string): boolean {
    return this.getEnvironment().toLowerCase().indexOf(env.toLowerCase()) === 0
  }
}
