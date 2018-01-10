import { Edmunds } from '../edmunds'
import { ServiceProvider } from './serviceprovider'
import { expect } from 'chai'
import 'mocha'

describe('serviceprovider.js', () => {

  it('should register', () => {
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

})
