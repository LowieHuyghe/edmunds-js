import ServiceProvider from '../support/serviceprovider'
import DatabaseManager from './databasemanager'

export default class DatabaseServiceProvider extends ServiceProvider {
  /**
   * Register the service provider
   */
  register (): void {
    // Load instances
    let instances: any[] = []
    if (this.edmunds.config.has('database.instances')) {
      instances = this.edmunds.config.get('database.instances')
    }

    // Create manager
    const manager = new DatabaseManager(this.edmunds, instances)
    this.edmunds.app.set('edmunds-database-manager', manager)
  }
}
