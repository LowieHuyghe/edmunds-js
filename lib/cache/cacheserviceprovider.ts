import { ServiceProvider } from '../support/serviceprovider'
import { CacheManager } from './cachemanager'

export class CacheServiceProvider extends ServiceProvider {
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
  }
}
