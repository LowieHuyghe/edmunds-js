import Edmunds from '../edmunds/edmunds'
import Seeder from './seeder'
import { expect } from 'chai'
import 'mocha'
import * as appRootPath from 'app-root-path'

describe('Seeder', () => {

  it('should pass basics', async () => {
    class MySeeder extends Seeder {
      async call (): Promise<void> {
        expect(this.edmunds).to.equal(edmunds)
        return
      }
    }

    const edmunds = new Edmunds(appRootPath.path)
    const seeder = new MySeeder(edmunds)

    expect(seeder).to.be.instanceof(Seeder)
    await seeder.call()
  })

})
