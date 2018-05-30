import ServiceProvider from '../support/serviceprovider'
import DatabaseManager from './databasemanager'

export default class DatabaseServiceProvider extends ServiceProvider {
  /**
   * Register the service provider
   */
  async register (): Promise<void> {
    // Load instances
    let instances: any[] = []
    if (this.edmunds.config.has('database.instances')) {
      instances = this.edmunds.config.get('database.instances')
    }

    // Create manager
    const manager = new DatabaseManager(this.edmunds, instances)

    // If application is long-running, load all instance before-hand
    if (this.edmunds.isLongRunning()) {
      await manager.all()
    }

    this.edmunds.app.set('edmunds-database-manager', manager)
  }
}
