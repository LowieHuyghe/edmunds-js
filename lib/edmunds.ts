import * as express from 'express'
import { ServiceProvider } from './support/serviceprovider'
import * as config from 'config'
import { LoggerInstance } from 'winston'
import { getConnection, Connection } from 'typeorm'
import 'reflect-metadata'
import { CacheManager } from './cache/cachemanager'
import FileManager from './filesystem/filesystemmanager'
import FileSystemDriverInterface from './filesystem/drivers/filesystemdriverinterface'
import CacheDriverInterface from './cache/drivers/cachedriverinterface'

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
   * Cache Manager
   */
  public cacheManager: CacheManager

  /**
   * File Manager
   */
  public fileSystemManager: FileManager

  /**
   * Constructor
   * @param {string} root The root path
   * @param {express.Express} app
   */
  constructor (root: string, app?: express.Express) {
    this.root = root
    this.app = app || express()
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
   * Get environment
   * @returns {string}
   */
  getEnvironment (): string {
    return this.app.get('env')
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
   * Get cache instance
   * @param {string} name
   * @returns {CacheDriverInterface}
   */
  cache (name?: string): CacheDriverInterface {
    return this.cacheManager.get(name)
  }

  /**
   * Get file system instance
   * @param {string} name
   * @returns {FileSystemDriverInterface}
   */
  fileSystem (name?: string): FileSystemDriverInterface {
    return this.fileSystemManager.get(name)
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
    return this.getEnvironment().toLowerCase().indexOf(env.toLowerCase()) === 0
  }
}
