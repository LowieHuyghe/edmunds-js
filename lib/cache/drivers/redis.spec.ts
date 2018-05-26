import Edmunds from '../../edmunds'
import CacheManager from '../cachemanager'
import Redis from './redis'
import * as appRootPath from 'app-root-path'
import * as redis from 'redis'
import * as chai from 'chai'
import 'mocha'

const chaiAsPromised = require('chai-as-promised')
chai.use(chaiAsPromised)
const expect = chai.expect

describe('Redis', () => {
  function getDriver (): Redis {
    const options: redis.ClientOpts = {
      host: '192.168.123.123'
    }
    const config = [{
      name: 'redis1',
      driver: 'redis',
      ...options
    }]

    const edmunds = new Edmunds(appRootPath.path)
    const manager = new CacheManager(edmunds, config)

    const instance = manager.get()
    expect(instance).to.be.an.instanceof(Redis)
    expect((instance as Redis).redis).to.be.an.instanceof(redis.RedisClient)
    return instance as Redis
  }

  it('should have a working get', async () => {
    const driver = getDriver()

    const keyExists = 'myKey1'
    const keyDoesNotExist = 'myKey2'
    const keyGivesError = 'myKey3'

    driver.redis.get = (key: string, cb?: redis.Callback<string>): boolean => {
      if (key === keyExists) {
        cb(undefined, 'validValue')
      } else if (key === keyDoesNotExist) {
        cb(undefined, null)
      } else if (key === keyGivesError) {
        cb(new Error('An error'), undefined)
      }
      return true
    }

    try {
      expect(await driver.get(keyExists)).to.equal('validValue')
      expect(await driver.get(keyDoesNotExist)).to.be.a('undefined')
      await expect(driver.get(keyGivesError)).to.be.rejectedWith('An error')
    } finally {
      driver.redis.end(false)
    }
  })

  it('should have a working set', async () => {
    const driver = getDriver()

    const keyWorks = 'myKey1'
    const keyDoesNotWork = 'myKey2'
    const keyGivesError = 'myKey3'

    driver.redis.set = ((key: string, value: string, mode: string, duration: number, cb?: redis.Callback<'OK' | undefined>): boolean => {
      if (key === keyWorks) {
        cb(undefined, 'OK')
      } else if (key === keyDoesNotWork) {
        cb(undefined, undefined)
      } else if (key === keyGivesError) {
        cb(new Error('An error'), undefined)
      }
      return true
    }) as any

    try {
      expect(await driver.set(keyWorks, 'someValue', 10)).to.be.a('undefined')
      await expect(driver.set(keyDoesNotWork, 'someValue', 10)).to.be.rejectedWith(`Could not set redis-value with key "${keyDoesNotWork}"`)
      await expect(driver.set(keyGivesError, 'someValue', 10)).to.be.rejectedWith('An error')
    } finally {
      driver.redis.end(false)
    }
  })

  it('should have a working del', async () => {
    const driver = getDriver()

    const keyWorks = 'myKey1'
    const keyDoesNotWork = 'myKey2'
    const keyGivesError = 'myKey3'

    driver.redis.del = ((key: string, cb?: (err: Error, response: number) => void): boolean => {
      if (key === keyWorks) {
        cb(undefined, 1)
      } else if (key === keyDoesNotWork) {
        cb(undefined, 0)
      } else if (key === keyGivesError) {
        cb(new Error('An error'), undefined)
      }
      return true
    }) as any

    try {
      expect(await driver.del(keyWorks)).to.be.a('undefined')
      await expect(driver.del(keyDoesNotWork)).to.be.rejectedWith(`Could not delete redis-value with key "${keyDoesNotWork}" (0)`)
      await expect(driver.del(keyGivesError)).to.be.rejectedWith('An error')
    } finally {
      driver.redis.end(false)
    }
  })

})
