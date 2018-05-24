export default interface CacheDriverInterface {
  /**
   * Set value in the cache
   * @param {string} key
   * @param data
   * @param {number} lifetime
   * @return {Promise<void>}
   */
  set (key: string, data: any, lifetime: number): Promise<void>

  /**
   * Get the value from cache
   * @param {string} key
   * @return {Promise<any>}
   */
  get (key: string): Promise<any>

  /**
   * Delete the value from cache
   * @param {string} key
   * @return {Promise<void>}
   */
  del (key: string): Promise<void>
}
