import BaseManager from './basemanager'

/**
 * Sync Manager abstract class
 */
export default abstract class SyncManager<T> extends BaseManager<T> {
  /**
   * Get the instance
   * @param {string} name
   * @returns {T}
   */
  get (name?: string): T {
    if (!name) {
      this.createFirst()
      return this.instances[this.instancesConfig[0].name]
    }

    this.createSingle(name)
    return this.instances[name]
  }

  /**
   * Get all instances
   * @returns {T}
   */
  all (): { [key: string]: T } {
    this.createAll()
    return { ...this.instances }
  }
}
