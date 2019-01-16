import ServiceProvider from '../support/serviceprovider'
import FileSystemManager from './filesystemmanager'

export default class FileSystemServiceProvider extends ServiceProvider {
  /**
   * Register the service provider
   */
  register (): void {
    // Load instances
    let instances: any[] = []
    if (this.edmunds.config.has('filesystem.instance')) {
      instances = [this.edmunds.config.get('filesystem.instance')]
    } else if (this.edmunds.config.has('filesystem.instances')) {
      instances = this.edmunds.config.get('filesystem.instances')
    }

    // Create manager
    const manager = new FileSystemManager(this.edmunds, instances)
    this.edmunds.app.set('edmunds-filesystem-manager', manager)
  }
}
