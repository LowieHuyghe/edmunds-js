import Edmunds from '../../edmunds'
import CacheManager from '../cachemanager'
import Memcached from './memcached'
import * as appRootPath from 'app-root-path'
import * as memcached from 'memcached'
import * as chai from 'chai'
import 'mocha'

const chaiAsPromised = require('chai-as-promised')
chai.use(chaiAsPromised)
const expect = chai.expect

describe('Memcached', () => {
  async function getDriver (): Promise<Memcached> {
    const options: memcached.options = {
      maxKeySize: 200
    }
    const config = [{
      name: 'memcached1',
      driver: 'memcached',
      servers: '192.168.123.123:11211',
      ...options
    }]

    const edmunds = new Edmunds(appRootPath.path)
    const manager = new CacheManager(edmunds, config)

    const instance = await manager.get()
    expect(instance).to.be.an.instanceof(Memcached)
    expect((instance as Memcached).memcached).to.be.an.instanceof(memcached)
    return instance as Memcached
  }

  it('should have a working get', async () => {
    const driver = await getDriver()

    const keyExists = 'myKey1'
    const keyDoesNotExist = 'myKey2'
    const keyGivesError = 'myKey3'

    driver.memcached.get = (key: string, cb?: (err: any, data: any) => void): void => {
      if (key === keyExists) {
        cb(undefined, 'validValue')
      } else if (key === keyDoesNotExist) {
        cb(undefined, null)
      } else if (key === keyGivesError) {
        cb(new Error('An error'), undefined)
      }
    }

    try {
      expect(await driver.get(keyExists)).to.equal('validValue')
      expect(await driver.get(keyDoesNotExist)).to.be.a('undefined')
      await expect(driver.get(keyGivesError)).to.be.rejectedWith('An error')
    } finally {
      driver.memcached.end()
    }
  })

  it('should have a working set', async () => {
    const driver = await getDriver()

    const keyWorks = 'myKey1'
    const keyDoesNotWork = 'myKey2'
    const keyGivesError = 'myKey3'

    driver.memcached.set = (key: string, value: string, lifetime: number, cb?: (err: any, result: boolean) => void): void => {
      if (key === keyWorks) {
        cb(undefined, true)
      } else if (key === keyDoesNotWork) {
        cb(undefined, false)
      } else if (key === keyGivesError) {
        cb(new Error('An error'), false)
      }
    }

    try {
      expect(await driver.set(keyWorks, 'someValue', 10)).to.be.a('undefined')
      await expect(driver.set(keyDoesNotWork, 'someValue', 10)).to.be.rejectedWith(`Could not set memcached-value with key "${keyDoesNotWork}"`)
      await expect(driver.set(keyGivesError, 'someValue', 10)).to.be.rejectedWith('An error')
    } finally {
      driver.memcached.end()
    }
  })

  it('should have a working del', async () => {
    const driver = await getDriver()

    const keyWorks = 'myKey1'
    const keyDoesNotWork = 'myKey2'
    const keyGivesError = 'myKey3'

    driver.memcached.del = (key: string, cb?: (err: any, result: boolean) => void): void => {
      if (key === keyWorks) {
        cb(undefined, true)
      } else if (key === keyDoesNotWork) {
        cb(undefined, false)
      } else if (key === keyGivesError) {
        cb(new Error('An error'), undefined)
      }
    }

    try {
      expect(await driver.del(keyWorks)).to.be.a('undefined')
      await expect(driver.del(keyDoesNotWork)).to.be.rejectedWith(`Could not delete memcached-value with key "${keyDoesNotWork}"`)
      await expect(driver.del(keyGivesError)).to.be.rejectedWith('An error')
    } finally {
      driver.memcached.end()
    }
  })

})
