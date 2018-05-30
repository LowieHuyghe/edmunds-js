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
        instances: [
          {
            name: 'default',
            type: 'sqljs',
            database: 'database1'
          },
          {
            name: 'sqljs2',
            type: 'sqljs',
            database: 'database2'
          }
        ]
      }
    })
    const edmunds = new Edmunds(appRootPath.path)
    edmunds.config = importFresh('config')

    await edmunds.register(DatabaseServiceProvider)
    expect(await edmunds.database()).to.be.instanceof(Connection)
    expect((await edmunds.database()).isConnected).to.equal(true)
    expect((await edmunds.database()).options).to.include({
      name: 'default',
      type: 'sqljs',
      database: 'database1'
    })
    expect(await edmunds.database('default')).to.be.instanceof(Connection)
    expect((await edmunds.database('default')).isConnected).to.equal(true)
    expect((await edmunds.database('default')).options).to.include({
      name: 'default',
      type: 'sqljs',
      database: 'database1'
    })
    expect(await edmunds.database('sqljs2')).to.be.instanceof(Connection)
    expect((await edmunds.database('sqljs2')).isConnected).to.equal(true)
    expect((await edmunds.database('sqljs2')).options).to.include({
      name: 'sqljs2',
      type: 'sqljs',
      database: 'database2'
    })
  }).timeout(10000)

})
