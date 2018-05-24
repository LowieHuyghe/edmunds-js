import { Manager } from '../support/manager'

export class CacheManager extends Manager {
  /**
   * Create Redis client
   * @param {any} config
   * @returns {Redis}
   */
  protected createRedis (config: any): any {
    const { default: Redis } = require('./drivers/redis')

    return new Redis(config)
  }

  /**
   * Create Memcached client
   * @param {any} config
   * @returns {Memcached}
   */
  protected createMemcached (config: any): any {
    const { default: Memcached } = require('./drivers/memcached')
    const {
      servers,
      ...remainingConfig
    } = config

    if (!servers) {
      throw new Error(`'servers'-config is missing for cache-instance '${config.name}'`)
    }

    return new Memcached(config.servers, remainingConfig)
  }

  /**
   * Create Firebase Realtime Database client
   * @param {any} config
   * @returns {FirebaseRealtimeDatabase}
   */
  protected createFirebaserealtimedatabase (config: any): any {
    const { default: FirebaseRealtimeDatabase } = require('./drivers/firebaserealtimedatabase')

    const name = config.name
    const key = config.ref ? config.ref : 'cache'
    let options = undefined
    if (config.credentials || config.databaseAuthVariableOverride || config.databaseURL || config.storageBucket || config.projectId) {
      options = config
    }

    return new FirebaseRealtimeDatabase(name, key, options)
  }
}
