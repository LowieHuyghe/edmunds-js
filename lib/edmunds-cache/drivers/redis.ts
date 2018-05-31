import CacheDriverInterface from '../../edmunds/foundation/cachedriverinterface'
import * as redis from 'redis'

/**
 * Caching class using Redis
 */
export default class Redis implements CacheDriverInterface {
  /**
   * Database reference
   */
  public redis: redis.RedisClient

  /**
   * Constructor
   * @param {redis.ClientOpts} config
   */
  constructor (config: redis.ClientOpts) {
    this.redis = redis.createClient(config)
  }

  /**
   * Set value in the cache
   * @param {string} key
   * @param data
   * @param {number} lifetime
   * @return {Promise<void>}
   */
  set (key: string, data: any, lifetime: number): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.redis.set(key, data, 'EX', lifetime, (err: Error, response: 'OK' | undefined) => {
        if (err) {
          reject(err)
        } else if (response !== 'OK') {
          reject(new Error(`Could not set redis-value with key "${key}"`))
        } else {
          resolve()
        }
      })
    })
  }

  /**
   * Get the value from cache
   * @param {string} key
   * @return {Promise<any>}
   */
  async get (key: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.redis.get(key, (err: Error, response: string) => {
        if (err) {
          reject(err)
        } else {
          resolve(response === null ? undefined : response)
        }
      })
    })
  }

  /**
   * Delete the value from cache
   * @param {string} key
   * @return {Promise<void>}
   */
  del (key: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.redis.del(key, (err: Error, response: number) => {
        if (err) {
          reject(err)
        } else if (response !== 1) {
          reject(new Error(`Could not delete redis-value with key "${key}" (${response})`))
        } else {
          resolve()
        }
      })
    })
  }

  /**
   * Close the connection
   * @returns {Promise<void>}
   */
  async close (): Promise<void> {
    this.redis.end()
  }
}
