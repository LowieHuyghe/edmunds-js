import { Edmunds } from './edmunds'
import { ServiceProvider } from './support/serviceprovider'
import { expect } from 'chai'
import * as express from 'express'
import * as config from 'config'
import * as appRootPath from 'app-root-path'
import 'mocha'
import * as importFresh from 'import-fresh'
import { DatabaseServiceProvider } from './database/databaseserviceprovider'
import {
  Connection,
  getConnectionManager
} from 'typeorm'

describe('edmunds.js', () => {
  afterEach(async () => {
    const connManager = getConnectionManager()
    for (let name of ['default', 'sqljs2']) {
      if (connManager.has(name) && connManager.get(name).isConnected) {
        await connManager.get(name).close()
      }
    }
  })

  it('should have express', () => {
    const edmunds = new Edmunds(appRootPath.path)
    expect(typeof edmunds.app).to.equal(typeof express())
    expect(edmunds.app.get('edmunds')).to.equal(edmunds)
  })

  it('should use given express', () => {
    const app = express()
    const edmunds = new Edmunds(appRootPath.path, app)
    expect(edmunds.app).to.equal(app)
    expect(app.get('edmunds')).to.equal(edmunds)
  })

  it('should have instance of config', () => {
    const edmunds = new Edmunds(appRootPath.path)
    expect(edmunds.config).to.equal(config)
  })

  it('should register service providers', async () => {
    class MyServiceProvider extends ServiceProvider {
      static registerCount: number = 0

      async register (): Promise<void> {
        // Registering
        ++MyServiceProvider.registerCount
      }
    }

    const edmunds = new Edmunds(appRootPath.path)
    expect(MyServiceProvider.registerCount).to.equal(0)
    await edmunds.register(MyServiceProvider)
    expect(MyServiceProvider.registerCount).to.equal(1)
    await edmunds.register(MyServiceProvider)
    expect(MyServiceProvider.registerCount).to.equal(2)
  })

  it('should have correct environment', () => {
    const data = [
      { given: 'testing', expected: 'test' },
      { given: 'teSTing-01', expected: 'test' },
      { given: 'test', expected: 'test' },
      { given: 'etest', expected: null },
      { given: 'staging', expected: 'stag' },
      { given: 'staGIng-01', expected: 'stag' },
      { given: 'stag', expected: 'stag' },
      { given: 'estag', expected: null },
      { given: 'production', expected: 'prod' },
      { given: 'proDUction-01', expected: 'prod' },
      { given: 'prod', expected: 'prod' },
      { given: 'eprod', expected: null },
      { given: 'development', expected: 'dev' },
      { given: 'deVElopment-01', expected: 'dev' },
      { given: 'dev', expected: 'dev' },
      { given: 'edev', expected: null },
      { given: '', expected: 'dev' },
      { given: 'gibberish', expected: null }
    ]

    for (let { given, expected } of data) {
      process.env.NODE_ENV = given
      const edmunds = new Edmunds(appRootPath.path)
      edmunds.config = importFresh('config')

      expect(edmunds.isDevelopment(), given).to.equal(expected === 'dev')
      expect(edmunds.isStaging(), given).to.equal(expected === 'stag')
      expect(edmunds.isProduction(), given).to.equal(expected === 'prod')
      expect(edmunds.isTesting(), given).to.equal(expected === 'test')
    }
  })

  it('should have functioning database function', async () => {
    const edmunds = new Edmunds(appRootPath.path)

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
