import { ServiceProvider } from '../support/serviceprovider'
import FileSystemManager from './filesystemmanager'

export default class FileSystemServiceProvider extends ServiceProvider {
  /**
   * Register the service provider
   */
  async register (): Promise<void> {
    // Load instances
    let instances: any[] = []
    if (this.edmunds.config.has('file.instances')) {
      instances = this.edmunds.config.get('file.instances')
    }

    // Create manager
    this.edmunds.fileSystemManager = new FileSystemManager(this.edmunds, instances)
  }
}
