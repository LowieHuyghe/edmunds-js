import Edmunds from '../edmunds'
import Manager from './manager'
import { expect } from 'chai'
import * as appRootPath from 'app-root-path'
import 'mocha'

describe('manager.js', () => {

  it('should have basic functionality', async () => {
    class MyManager extends Manager<string> {
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
    const manager = new MyManager(edmunds, instances)

    expect(manager.get()).to.be.instanceof(Promise)
    expect(await manager.get()).to.equal('John Snow 1')
    expect(manager.get('arya1')).to.be.instanceof(Promise)
    expect(await manager.get('arya1')).to.equal('Arya Stark 1')
    expect(manager.get('John2')).to.be.instanceof(Promise)
    expect(await manager.get('John2')).to.equal('John Snow 2')
    expect(manager.get('john1')).to.be.instanceof(Promise)
    expect(await manager.get('john1')).to.equal('John Snow 1')
    expect(manager.all()).to.be.instanceof(Promise)
    expect(await manager.all()).to.deep.equal({
      John2: 'John Snow 2',
      john1: 'John Snow 1',
      arya1: 'Arya Stark 1'
    })
  })

  it('should handle double declaration', async () => {
    class MyManager extends Manager<string> {
      protected createJohn (config: any) {
        return 'John Snow ' + config.number
      }
    }

    const edmunds = new Edmunds(appRootPath.path)
    const instances = [
      { name: 'john1', driver: 'john', number: 1 },
      { name: 'john1', driver: 'JOHN', number: 1 }
    ]
    const manager = new MyManager(edmunds, instances)

    await expect(manager.get()).to.be.rejectedWith('Re-declaring instance with name "john1"')
    await expect(manager.all()).to.be.rejectedWith('Re-declaring instance with name "john1"')
  })

  it('should handle non-existing drivers', async () => {
    class MyManager extends Manager<string> {
      protected createJohn (config: any) {
        return 'John Snow ' + config.number
      }
    }

    const edmunds = new Edmunds(appRootPath.path)
    const instances = [
      { name: 'john1', driver: 'john', number: 1 },
      { name: 'arya1', driver: 'arya', number: 1 }
    ]
    const manager = new MyManager(edmunds, instances)

    await expect(manager.get()).to.be.rejectedWith('Method "createArya" for driver "arya" does not exist')
    await expect(manager.get('john1')).to.be.rejectedWith('Method "createArya" for driver "arya" does not exist')
    await expect(manager.get('arya1')).to.be.rejectedWith('Method "createArya" for driver "arya" does not exist')
    await expect(manager.all()).to.be.rejectedWith('Method "createArya" for driver "arya" does not exist')
  })

  it('should handle missing name', async () => {
    class MyManager extends Manager<string> {
      protected createJohn (config: any) {
        return 'John Snow ' + config.number
      }
    }

    const edmunds = new Edmunds(appRootPath.path)

    let instances: any = [
      { driver: 'john', number: 1 }
    ]
    let manager = new MyManager(edmunds, instances)
    await expect(manager.get()).to.be.rejectedWith('Missing name for declared instance')

    instances = [
      { name: '', driver: 'john', number: 1 }
    ]
    manager = new MyManager(edmunds, instances)
    await expect(manager.get()).to.be.rejectedWith('Missing name for declared instance')

    instances = [
      { name: null, driver: 'john', number: 1 }
    ]
    manager = new MyManager(edmunds, instances)
    await expect(manager.get()).to.be.rejectedWith('Missing name for declared instance')
  })

})
