import Edmunds from '../edmunds'
import DatabaseServiceProvider from './databaseserviceprovider'
import { expect } from 'chai'
import 'mocha'
import * as appRootPath from 'app-root-path'
import {
  Connection,
  getConnectionManager
} from 'typeorm'
import * as importFresh from 'import-fresh'
import DatabaseManager from './databasemanager'

describe('databaseserviceprovider.ts', () => {
  afterEach(async () => {
    const connManager = getConnectionManager()
    for (let name of ['default', 'sqljs2']) {
      if (connManager.has(name) && connManager.get(name).isConnected) {
        await connManager.get(name).close()
      }
    }
  })

  it('should have database', async () => {
    // Override config
    process.env.NODE_CONFIG = JSON.stringify({
      database: {
        instances: [{
          name: 'database1',
          type: 'sqljs'
        }]
      }
    })
    const edmunds = new Edmunds(appRootPath.path)
    edmunds.config = importFresh('config')

    expect(edmunds.app.get('edmunds-database-manager')).to.be.an('undefined')
    await edmunds.register(DatabaseServiceProvider)
    expect(edmunds.app.get('edmunds-database-manager')).to.be.instanceof(DatabaseManager)

    try {
      expect(await edmunds.database()).to.be.instanceof(Connection)
      expect((await edmunds.database()).isConnected).to.equal(true)
      expect((await edmunds.database()).options).to.include({
        name: 'database1',
        type: 'sqljs'
      })
      expect(await edmunds.app.get('edmunds-database-manager').get()).to.be.instanceof(Connection)
      expect((await edmunds.app.get('edmunds-database-manager').get()).isConnected).to.equal(true)
      expect((await edmunds.app.get('edmunds-database-manager').get()).options).to.include({
        name: 'database1',
        type: 'sqljs'
      })
    } finally {
      await (await edmunds.database()).close()
    }
  }).timeout(10000)

})
