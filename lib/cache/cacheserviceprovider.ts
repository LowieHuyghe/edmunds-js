import ServiceProvider from '../support/serviceprovider'
import CacheManager from './cachemanager'

export default class CacheServiceProvider extends ServiceProvider {
  /**
   * Register the service provider
   */
  register (): void {
    // Load instances
    let instances: any[] = []
    if (this.edmunds.config.has('cache.instance')) {
      instances = [this.edmunds.config.get('cache.instance')]
    } else if (this.edmunds.config.has('cache.instances')) {
      instances = this.edmunds.config.get('cache.instances')
    }

    // Create manager
    const manager = new CacheManager(this.edmunds, instances)
    this.edmunds.app.set('edmunds-cache-manager', manager)
  }
}
