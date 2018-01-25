import { Edmunds } from './edmunds'
import { ServiceProvider } from './support/serviceprovider'
import { expect } from 'chai'
import * as express from 'express'
import * as config from 'config'
import 'mocha'
import * as importFresh from 'import-fresh'
import { DatabaseServiceProvider } from './database/databaseserviceprovider'
import {
  Connection,
  getConnectionManager
} from 'typeorm'

describe('edmunds.js', () => {
  const databaseConnections: string[] = []

  afterEach(async () => {
    const connManager = getConnectionManager()
    for (let name of databaseConnections) {
      if (connManager.has(name) && connManager.get(name).isConnected) {
        await connManager.get(name).close()
      }
    }
  })

  it('should have express', () => {
    const edmunds = new Edmunds()
    expect(typeof edmunds.app).to.equal(typeof express())
    expect(edmunds.app.get('edmunds')).to.equal(edmunds)
  })

  it('should use given express', () => {
    const app = express()
    const edmunds = new Edmunds(app)
    expect(edmunds.app).to.equal(app)
    expect(app.get('edmunds')).to.equal(edmunds)
  })

  it('should have instance of config', () => {
    const edmunds = new Edmunds()
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

    const edmunds = new Edmunds()
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
      const edmunds = new Edmunds()
      edmunds.config = importFresh('config')

      expect(edmunds.isDevelopment(), given).to.equal(expected === 'dev')
      expect(edmunds.isStaging(), given).to.equal(expected === 'stag')
      expect(edmunds.isProduction(), given).to.equal(expected === 'prod')
      expect(edmunds.isTesting(), given).to.equal(expected === 'test')
    }
  })

  it('should have functioning database function', async () => {
    // Override config
    process.env.NODE_CONFIG = JSON.stringify({
      database: {
        instances: [{
          name: 'default',
          type: 'sqljs',
          database: 'edmunds.js.database'
        }]
      }
    })
    databaseConnections.push('default')

    const edmunds = new Edmunds()
    edmunds.config = importFresh('config')

    const connManager = getConnectionManager()
    if (connManager.has('default')) {
      expect(edmunds.database().options).to.not.include({
        name: 'default',
        type: 'sqljs',
        database: 'edmunds.js.database'
      })
    }

    await edmunds.register(DatabaseServiceProvider)
    expect(edmunds.database()).to.be.instanceof(Connection)
    expect(edmunds.database().options).to.include({
      name: 'default',
      type: 'sqljs',
      database: 'edmunds.js.database'
    })
  })

})
