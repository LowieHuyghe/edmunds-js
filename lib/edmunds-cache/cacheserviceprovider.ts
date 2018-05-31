import ServiceProvider from '../edmunds/support/serviceprovider'
import CacheManager from './cachemanager'

export default class CacheServiceProvider extends ServiceProvider {
  /**
   * Register the service provider
   */
  async register (): Promise<void> {
    // Load instances
    let instances: any[] = []
    if (this.edmunds.config.has('cache.instances')) {
      instances = this.edmunds.config.get('cache.instances')
    }

    // Create manager
    const manager = new CacheManager(this.edmunds, instances)

    // If application is long-running, load all instance before-hand
    if (this.edmunds.isLongRunning()) {
      await manager.all()
    }

    this.edmunds.app.set('edmunds-cache-manager', manager)
  }
}
