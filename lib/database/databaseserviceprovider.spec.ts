import { Edmunds } from '../edmunds'
import { DatabaseServiceProvider } from './databaseserviceprovider'
import { expect } from 'chai'
import 'mocha'
import {
  Connection,
  getConnectionManager
} from 'typeorm'

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
    const edmunds = new Edmunds()

    const connManager = getConnectionManager()
    if (connManager.has('default')) {
      expect(edmunds.database('default').isConnected).to.equal(false)
    }
    if (connManager.has('sqljs2')) {
      expect(edmunds.database('sqljs2').isConnected).to.equal(false)
    }

    await edmunds.register(DatabaseServiceProvider)
    expect(edmunds.database()).to.be.instanceof(Connection)
    expect(edmunds.database().isConnected).to.equal(true)
    expect(edmunds.database().options).to.include({
      name: 'default',
      type: 'sqljs',
      database: 'database1'
    })
    expect(edmunds.database('default')).to.be.instanceof(Connection)
    expect(edmunds.database('default').isConnected).to.equal(true)
    expect(edmunds.database('default').options).to.include({
      name: 'default',
      type: 'sqljs',
      database: 'database1'
    })
    expect(edmunds.database('sqljs2')).to.be.instanceof(Connection)
    expect(edmunds.database('sqljs2').isConnected).to.equal(true)
    expect(edmunds.database('sqljs2').options).to.include({
      name: 'sqljs2',
      type: 'sqljs',
      database: 'database2'
    })
  })

})
