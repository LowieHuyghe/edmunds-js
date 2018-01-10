import { Edmunds } from '../edmunds'
import { Manager } from './manager'
import { expect } from 'chai'
import 'mocha'

describe('manager.js', () => {

  it('should have basic functionality', () => {
    class MyManager extends Manager {
      protected createJohn (config: any) {
        return 'John Snow ' + config.number
      }
      protected createArya (config: any) {
        return 'Arya Stark ' + config.number
      }
    }

    const edmunds = new Edmunds()
    const instances = [
      { name: 'john1', driver: 'john', number: 1 },
      { name: 'John2', driver: 'JOHN', number: 2 },
      { name: 'arya1', driver: 'arya', number: 1 }
    ]
    const manager = new MyManager(edmunds, instances)

    expect(manager.get()).to.equal('John Snow 1')
    expect(manager.get('john1')).to.equal('John Snow 1')
    expect(manager.get('John2')).to.equal('John Snow 2')
    expect(manager.get('arya1')).to.equal('Arya Stark 1')
  })

  it('should handle double declaration', () => {
    class MyManager extends Manager {
      protected createJohn (config: any) {
        return 'John Snow ' + config.number
      }
    }

    const edmunds = new Edmunds()
    const instances = [
      { name: 'john1', driver: 'john', number: 1 },
      { name: 'john1', driver: 'JOHN', number: 1 }
    ]
    const manager = new MyManager(edmunds, instances)

    expect(() => manager.get()).to.throw('Re-declaring instance with name "john1"')
  })

  it('should handle non-existing drivers', () => {
    class MyManager extends Manager {
      protected createJohn (config: any) {
        return 'John Snow ' + config.number
      }
    }

    const edmunds = new Edmunds()
    const instances = [
      { name: 'arya1', driver: 'arya', number: 1 }
    ]
    const manager = new MyManager(edmunds, instances)

    expect(() => manager.get()).to.throw('Method "createArya" for driver "arya" does not exist')
  })

})
