import Edmunds from '../edmunds'
import SyncManager from './syncmanager'
import { expect } from 'chai'
import * as appRootPath from 'app-root-path'
import 'mocha'

describe('syncmanager.js', () => {

  it('should have basic functionality', () => {
    class MySyncManager extends SyncManager<string> {
      protected createJohn (config: any) {
        return 'John Snow ' + config.number
      }
      protected createArya (config: any) {
        return 'Arya Stark ' + config.number
      }
    }

    const edmunds = new Edmunds(appRootPath.path)
    const instances = [
      { name: 'john1', driver: 'john', number: 1 },
      { name: 'John2', driver: 'JOHN', number: 2 },
      { name: 'arya1', driver: 'arya', number: 1 }
    ]
    const manager = new MySyncManager(edmunds, instances)

    expect(manager.get()).to.equal('John Snow 1')
    expect(manager.get('arya1')).to.equal('Arya Stark 1')
    expect(manager.get('John2')).to.equal('John Snow 2')
    expect(manager.get('john1')).to.equal('John Snow 1')
    expect(manager.all()).to.deep.equal({
      John2: 'John Snow 2',
      john1: 'John Snow 1',
      arya1: 'Arya Stark 1'
    })
  })

  it('should handle double declaration', () => {
    class MySyncManager extends SyncManager<string> {
      protected createJohn (config: any) {
        return 'John Snow ' + config.number
      }
    }

    const edmunds = new Edmunds(appRootPath.path)
    const instances = [
      { name: 'john1', driver: 'john', number: 1 },
      { name: 'john1', driver: 'JOHN', number: 1 }
    ]
    const manager = new MySyncManager(edmunds, instances)

    expect(() => manager.get()).to.throw('Re-declaring instance with name "john1"')
    expect(() => manager.all()).to.throw('Re-declaring instance with name "john1"')
  })

  it('should handle non-existing drivers', () => {
    class MySyncManager extends SyncManager<string> {
      protected createJohn (config: any) {
        return 'John Snow ' + config.number
      }
    }

    const edmunds = new Edmunds(appRootPath.path)
    const instances = [
      { name: 'john1', driver: 'john', number: 1 },
      { name: 'arya1', driver: 'arya', number: 1 }
    ]
    const manager = new MySyncManager(edmunds, instances)

    expect(() => manager.get()).to.throw('Method "createArya" for driver "arya" does not exist')
    expect(() => manager.get('john1')).to.throw('Method "createArya" for driver "arya" does not exist')
    expect(() => manager.get('arya1')).to.throw('Method "createArya" for driver "arya" does not exist')
    expect(() => manager.all()).to.throw('Method "createArya" for driver "arya" does not exist')
  })

  it('should handle missing name', () => {
    class MySyncManager extends SyncManager<string> {
      protected createJohn (config: any) {
        return 'John Snow ' + config.number
      }
    }

    const edmunds = new Edmunds(appRootPath.path)

    let instances: any = [
      { driver: 'john', number: 1 }
    ]
    let manager = new MySyncManager(edmunds, instances)
    expect(() => manager.get()).to.throw('Missing name for declared instance')

    instances = [
      { name: '', driver: 'john', number: 1 }
    ]
    manager = new MySyncManager(edmunds, instances)
    expect(() => manager.get()).to.throw('Missing name for declared instance')

    instances = [
      { name: null, driver: 'john', number: 1 }
    ]
    manager = new MySyncManager(edmunds, instances)
    expect(() => manager.get()).to.throw('Missing name for declared instance')
  })

})
