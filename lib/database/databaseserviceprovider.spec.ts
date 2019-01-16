import Edmunds from '../edmunds'
import DatabaseServiceProvider from './databaseserviceprovider'
import 'mocha'
import * as appRootPath from 'app-root-path'
import {
  Connection,
  getConnectionManager
} from 'typeorm'
import DatabaseManager from './databasemanager'
import * as chai from 'chai'
import * as chaiAsPromised from 'chai-as-promised'

chai.use(chaiAsPromised)
const expect = chai.expect

describe('databaseserviceprovider.ts', () => {
  afterEach(async () => {
    const connManager = getConnectionManager()
    for (let name of ['default', 'sqljs2']) {
      if (connManager.has(name) && connManager.get(name).isConnected) {
        await connManager.get(name).close()
      }
    }
  })

  it('should have database multiple', async () => {
    // Override config
    process.env.NODE_CONFIG = JSON.stringify({
      database: {
        instances: [
          {
            name: 'default',
            type: 'sqljs'
          },
          {
            name: 'sqljs2',
            type: 'sqljs'
          }
        ]
      }
    })
    const edmunds = new Edmunds(appRootPath.path)
    delete require.cache[require.resolve('config')]
    edmunds.config = require('config')

    expect(edmunds.app.get('edmunds-database-manager')).to.be.an('undefined')
    edmunds.register(DatabaseServiceProvider)
    expect(edmunds.app.get('edmunds-database-manager')).to.be.instanceof(DatabaseManager)

    try {
      expect(await edmunds.app.get('edmunds-database-manager').get()).to.be.instanceof(Connection)
      expect((await edmunds.app.get('edmunds-database-manager').get()).isConnected).to.equal(true)
      expect((await edmunds.app.get('edmunds-database-manager').get()).options).to.include({
        name: 'default',
        type: 'sqljs'
      })
      expect(await edmunds.database()).to.be.instanceof(Connection)
      expect((await edmunds.database()).isConnected).to.equal(true)
      expect((await edmunds.database()).options).to.include({
        name: 'default',
        type: 'sqljs'
      })
      expect(await edmunds.database('default')).to.be.instanceof(Connection)
      expect((await edmunds.database('default')).isConnected).to.equal(true)
      expect((await edmunds.database('default')).options).to.include({
        name: 'default',
        type: 'sqljs'
      })
      expect(await edmunds.database('sqljs2')).to.be.instanceof(Connection)
      expect((await edmunds.database('sqljs2')).isConnected).to.equal(true)
      expect((await edmunds.database('sqljs2')).options).to.include({
        name: 'sqljs2',
        type: 'sqljs'
      })
    } finally {
      await (await edmunds.database('default')).close()
      await (await edmunds.database('sqljs2')).close()
    }
  }).timeout(10000)

  it('should have database single', async () => {
    // Override config
    process.env.NODE_CONFIG = JSON.stringify({
      database: {
        instance: {
          name: 'default',
          type: 'sqljs'
        },
        instances: [
          {
            name: 'sqljs2',
            type: 'sqljs'
          },
          {
            name: 'sqljs3',
            type: 'sqljs'
          }
        ]
      }
    })
    const edmunds = new Edmunds(appRootPath.path)
    delete require.cache[require.resolve('config')]
    edmunds.config = require('config')

    expect(edmunds.app.get('edmunds-database-manager')).to.be.an('undefined')
    edmunds.register(DatabaseServiceProvider)
    expect(edmunds.app.get('edmunds-database-manager')).to.be.instanceof(DatabaseManager)

    try {
      expect(await edmunds.app.get('edmunds-database-manager').get()).to.be.instanceof(Connection)
      expect((await edmunds.app.get('edmunds-database-manager').get()).isConnected).to.equal(true)
      expect((await edmunds.app.get('edmunds-database-manager').get()).options).to.include({
        name: 'default',
        type: 'sqljs'
      })
      expect(await edmunds.database()).to.be.instanceof(Connection)
      expect((await edmunds.database()).isConnected).to.equal(true)
      expect((await edmunds.database()).options).to.include({
        name: 'default',
        type: 'sqljs'
      })
      expect(await edmunds.database('default')).to.be.instanceof(Connection)
      expect((await edmunds.database('default')).isConnected).to.equal(true)
      expect((await edmunds.database('default')).options).to.include({
        name: 'default',
        type: 'sqljs'
      })
      await expect(edmunds.database('sqljs2')).to.be.rejectedWith('No instance declared with name "sqljs2"')
      await expect(edmunds.database('sqljs3')).to.be.rejectedWith('No instance declared with name "sqljs3"')
    } finally {
      await (await edmunds.database('default')).close()
    }
  }).timeout(10000)

})
