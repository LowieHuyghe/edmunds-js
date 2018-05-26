import ServiceProvider from '../support/serviceprovider'
import {
  createConnections,
  ConnectionOptionsReader
} from 'typeorm'

export default class DatabaseServiceProvider extends ServiceProvider {
  /**
   * Register the service provider
   */
  async register (): Promise<void> {
    const optionsReader = new ConnectionOptionsReader({
      root: this.edmunds.root
    })
    const options = await optionsReader.all()

    await createConnections(options)
  }
}
