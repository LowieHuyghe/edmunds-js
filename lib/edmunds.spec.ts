import { Edmunds } from './edmunds'
import { ServiceProvider } from './support/serviceprovider'
import { expect } from 'chai'
import * as express from 'express'
import * as config from 'config'
import 'mocha'
import * as importFresh from 'import-fresh'

describe('edmunds.js', () => {

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

  it('should register service providers', () => {
    class MyServiceProvider extends ServiceProvider {
      static registerCount: number = 0

      register (): void {
        // Registering
        ++MyServiceProvider.registerCount
      }
    }

    const edmunds = new Edmunds()
    expect(MyServiceProvider.registerCount).to.equal(0)
    edmunds.register(MyServiceProvider)
    expect(MyServiceProvider.registerCount).to.equal(1)
    edmunds.register(MyServiceProvider)
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

})
