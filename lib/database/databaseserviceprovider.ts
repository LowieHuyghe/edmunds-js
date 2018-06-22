import ServiceProvider from '../support/serviceprovider'
import DatabaseManager from './databasemanager'
import * as path from 'path'
import * as fs from 'fs'

export default class DatabaseServiceProvider extends ServiceProvider {
  /**
   * Register the service provider
   */
  register (): void {
    const ormConfigFilePath = path.join(this.edmunds.root, 'ormconfig.json')

    // Load instances
    let instances: any[] = []
    if (fs.existsSync(ormConfigFilePath)) {
      instances = require(ormConfigFilePath)
    }

    // Create manager
    const manager = new DatabaseManager(this.edmunds, instances)
    this.edmunds.app.set('edmunds-database-manager', manager)
  }
}
