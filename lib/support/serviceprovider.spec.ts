import { Edmunds } from '../edmunds'
import { ServiceProvider } from './serviceprovider'
import { expect } from 'chai'
import * as appRootPath from 'app-root-path'
import 'mocha'

describe('serviceprovider.js', () => {

  it('should register', async () => {
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

})
