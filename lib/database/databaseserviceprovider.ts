import { ServiceProvider } from '../support/serviceprovider'
import {
  createConnections
} from 'typeorm'

export class DatabaseServiceProvider extends ServiceProvider {
  /**
   * Register the service provider
   */
  async register (): Promise<void> {
    await createConnections()
  }
}
