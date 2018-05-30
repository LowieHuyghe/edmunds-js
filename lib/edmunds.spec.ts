import Edmunds from './edmunds'
import ServiceProvider from './support/serviceprovider'
import { expect } from 'chai'
import * as express from 'express'
import * as config from 'config'
import * as appRootPath from 'app-root-path'
import 'mocha'
import * as importFresh from 'import-fresh'
import * as path from 'path'
import DatabaseServiceProvider from './database/databaseserviceprovider'
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

  it('should have correct root path', () => {
    const edmunds = new Edmunds(appRootPath.path)
    expect(edmunds.root).to.equal(path.resolve(__dirname + '/..'))
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

      expect(edmunds.getEnvironment()).to.equal(given !== '' ? given : 'development')
      expect(edmunds.isDevelopment()).to.equal(expected === 'dev')
      expect(edmunds.isStaging()).to.equal(expected === 'stag')
      expect(edmunds.isProduction()).to.equal(expected === 'prod')
      expect(edmunds.isTesting()).to.equal(expected === 'test')
    }
  })

  it('should have functioning database function', async () => {
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

  it('should be support long-running', () => {
    const data = [
      { given: { app: { } }, expected: false },
      { given: { app: { longrunning: false } }, expected: false },
      { given: { app: { longrunning: true } }, expected: true }
    ]

    for (let { given, expected } of data) {
      process.env.NODE_CONFIG = JSON.stringify(given)
      const edmunds = new Edmunds(appRootPath.path)
      edmunds.config = importFresh('config')

      expect(edmunds.isLongRunning()).to.equal(expected)
    }
  })
})
