import { Edmunds } from './edmunds'
import { ServiceProvider } from './support/serviceprovider'
import { expect } from 'chai'
import * as express from 'express'
import * as config from 'config'
import 'mocha'

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
    const edmunds = new Edmunds()
    expect(MyServiceProvider.registerCount).to.equal(0)
    edmunds.register(MyServiceProvider)
    expect(MyServiceProvider.registerCount).to.equal(1)
    edmunds.register(MyServiceProvider)
    expect(MyServiceProvider.registerCount).to.equal(2)
  })

})

class MyServiceProvider extends ServiceProvider {
  static registerCount: number = 0

  register (): void {
    // Registering
    ++MyServiceProvider.registerCount
  }
}
