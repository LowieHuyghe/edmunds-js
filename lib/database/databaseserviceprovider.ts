import { ServiceProvider } from '../support/serviceprovider'
import { DatabaseManager } from './databasemanager'
import { createConnections, ConnectionOptions } from 'typeorm'

export class DatabaseServiceProvider extends ServiceProvider {
  /**
   * Register the service provider
   */
  async register (): Promise<void> {
    let instances: any[] = []
    if (this.edmunds.config.has('database.instances')) {
      instances = this.edmunds.config.get('database.instances')
    }

    const manager = new DatabaseManager(this.edmunds, instances)
    const managerAll: any = manager.all()
    const options: ConnectionOptions[] = Object.keys(managerAll).map(key => managerAll[key])

    await createConnections(options)
  }
}
