import ServiceProvider from '../edmunds/support/serviceprovider'
import FileSystemManager from './filesystemmanager'

export default class FileSystemServiceProvider extends ServiceProvider {
  /**
   * Register the service provider
   */
  async register (): Promise<void> {
    // Load instances
    let instances: any[] = []
    if (this.edmunds.config.has('filesystem.instances')) {
      instances = this.edmunds.config.get('filesystem.instances')
    }

    // Create manager
    const manager = new FileSystemManager(this.edmunds, instances)

    // If application is long-running, load all instance before-hand
    if (this.edmunds.isLongRunning()) {
      await manager.all()
    }

    this.edmunds.app.set('edmunds-filesystem-manager', manager)
  }
}