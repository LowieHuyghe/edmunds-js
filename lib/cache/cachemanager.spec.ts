import { Edmunds } from '../edmunds'
import { CacheManager } from './cachemanager'
import FirebaseRealtimeDatabase from './drivers/firebaserealtimedatabase'
import Memcached from './drivers/memcached'
import Redis from './drivers/redis'
import { expect } from 'chai'
import * as appRootPath from 'app-root-path'
import 'mocha'
import * as memcached from 'memcached'
import * as redis from 'redis'

describe('CacheManager', () => {

  it('should have Redis', () => {
    const options: redis.ClientOpts = {
      host: '192.168.123.123'
    }
    const config = [{
      name: 'redis',
      driver: 'redis',
      ...options
    }]

    const edmunds = new Edmunds(appRootPath.path)
    const manager = new CacheManager(edmunds, config)

    expect(manager.get()).to.be.an.instanceof(Redis)
    expect(manager.get('redis')).to.be.an.instanceof(Redis)
  })

  it('should throw error when instantiating Memcached without servers', () => {
    const config = [{
      name: 'memcached',
      driver: 'memcached'
    }]

    const edmunds = new Edmunds(appRootPath.path)
    const manager = new CacheManager(edmunds, config)

    expect(() => manager.get()).to.throw("'servers'-config is missing for cache-instance 'memcached'")
  })

  it('should have Memcached', () => {
    const options: memcached.options = {
      maxKeySize: 200
    }
    const config = [{
      name: 'memcached',
      driver: 'memcached',
      servers: '192.168.123.123:11211',
      ...options
    }]

    const edmunds = new Edmunds(appRootPath.path)
    const manager = new CacheManager(edmunds, config)

    expect(manager.get()).to.be.an.instanceof(Memcached)
    expect(manager.get('memcached')).to.be.an.instanceof(Memcached)
  })

  it('should have FirebaseRealtimeDatabase', () => {
    const config = [{
      name: 'managerfirebaserealtimedatabase',
      driver: 'firebaserealtimedatabase',
      databaseURL: `https://totally-non-exisiting-project-${Math.round(Math.random() * 1000000)}.firebaseio.com`
    }]

    const edmunds = new Edmunds(appRootPath.path)
    const manager = new CacheManager(edmunds, config)

    const driver = manager.get()
    expect(driver).instanceof(FirebaseRealtimeDatabase)
  })

})
