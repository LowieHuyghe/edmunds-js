import { Edmunds } from '../edmunds'
import { DatabaseServiceProvider } from './databaseserviceprovider'
import { expect } from 'chai'
import 'mocha'
import * as importFresh from 'import-fresh'
import {
  Connection,
  getConnectionManager
} from 'typeorm'

describe('databaseserviceprovider.ts', () => {
  const databaseConnections: string[] = []

  afterEach(async () => {
    const connManager = getConnectionManager()
    for (let name of databaseConnections) {
      if (connManager.has(name) && connManager.get(name).isConnected) {
        await connManager.get(name).close()
      }
    }
  })

  it('should have database', async () => {
    // Override config
    process.env.NODE_CONFIG = JSON.stringify({
      database: {
        instances: [
          {
            name: 'default',
            type: 'sqljs',
            database: 'databaseserviceprovider.js.database'
          },
          {
            name: 'sqljs2',
            type: 'sqljs',
            database: 'databaseserviceprovider.js.database2'
          }
        ]
      }
    })
    databaseConnections.push('default')
    databaseConnections.push('sqljs2')

    const edmunds = new Edmunds()
    edmunds.config = importFresh('config')

    const connManager = getConnectionManager()
    if (connManager.has('default')) {
      expect(edmunds.database().options).to.not.include({
        name: 'default',
        type: 'sqljs',
        database: 'databaseserviceprovider.js.database'
      })
    }
    if (connManager.has('sqljs2')) {
      expect(edmunds.database().options).to.not.include({
        name: 'sqljs2',
        type: 'sqljs',
        database: 'databaseserviceprovider.js.database2'
      })
    }

    await edmunds.register(DatabaseServiceProvider)
    expect(edmunds.database()).to.be.instanceof(Connection)
    expect(edmunds.database().options).to.include({
      name: 'default',
      type: 'sqljs',
      database: 'databaseserviceprovider.js.database'
    })
    expect(edmunds.database('default')).to.be.instanceof(Connection)
    expect(edmunds.database('default').options).to.include({
      name: 'default',
      type: 'sqljs',
      database: 'databaseserviceprovider.js.database'
    })
    expect(edmunds.database('sqljs2')).to.be.instanceof(Connection)
    expect(edmunds.database('sqljs2').options).to.include({
      name: 'sqljs2',
      type: 'sqljs',
      database: 'databaseserviceprovider.js.database2'
    })
  })

})
