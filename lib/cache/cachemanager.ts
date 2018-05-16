import { Manager } from '../support/manager'
import { isUndefined } from 'util'

export class CacheManager extends Manager {
  /**
   * Create Redis client
   * @param {any} config
   * @returns {redis.RedisClient}
   */
  protected createRedis (config: any): any {
    const redis = require('redis')
    return redis.createClient(config)
  }

  /**
   * Create Memcached client
   * @param {any} config
   * @returns {memcached}
   */
  protected createMemcached (config: any): any {
    const Memcached = require('memcached')

    if (isUndefined(config.servers)) {
      throw new Error(`'servers'-config is missing for cache-instance '${config.name}'`)
    }

    return new Memcached(config.servers, config)
  }

  /**
   * Create Firebase Realtime Database client
   * @param {any} config
   * @returns {memcached}
   */
  protected createFirebaserealtimedatabase (config: any): any {
    const { FirebaseRealtimeDatabase } = require('./drivers/firebaserealtimedatabase')

    const name = config.name
    const key = config.ref ? config.ref : 'cache'
    let options = undefined
    if (config.credentials || config.databaseAuthVariableOverride || config.databaseURL || config.storageBucket || config.projectId) {
      options = config
    }

    return new FirebaseRealtimeDatabase(name, key, options)
  }
}
