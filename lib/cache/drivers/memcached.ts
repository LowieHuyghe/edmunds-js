import CacheDriverInterface from '../../foundation/cachedriverinterface'
import * as memcached from 'memcached'

/**
 * Caching class using Memcached
 */
export default class Memcached implements CacheDriverInterface {
  /**
   * Database reference
   */
  public memcached: memcached

  /**
   * Constructor
   * @param {Memcached.Location} location
   * @param {Memcached.options} options
   */
  constructor (location: memcached.Location, options: memcached.options) {
    this.memcached = new memcached(location, options)
  }

  /**
   * Set value in the cache
   * @param {string} key
   * @param data
   * @param {number} lifetime
   * @return {Promise<void>}
   */
  set (key: string, data: any, lifetime: number): Promise<void> {
    return new Promise((resolve, reject) => {
      this.memcached.set(key, data, lifetime, (err: any, result: boolean) => {
        if (err) {
          reject(err)
        } else if (!result) {
          reject(new Error(`Could not set memcached-value with key "${key}"`))
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
  get (key: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.memcached.get(key, (err: Error, response: any) => {
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
      this.memcached.del(key, (err: Error, result: boolean) => {
        if (err) {
          reject(err)
        } else if (!result) {
          reject(new Error(`Could not delete memcached-value with key "${key}"`))
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
    this.memcached.end()
  }
}
