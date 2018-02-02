import { Edmunds } from '../edmunds'
import { CacheManager } from './cachemanager'
import { FirebaseRealtimeDatabase } from './drivers/firebaserealtimedatabase'
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

    expect(manager.get()).to.be.an.instanceof(redis.RedisClient)
    expect(manager.get('redis')).to.be.an.instanceof(redis.RedisClient)
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

    expect(manager.get()).to.be.an.instanceof(memcached)
    expect(manager.get('memcached')).to.be.an.instanceof(memcached)
  })

  it('should have FirebaseRealtimeDatabase with admin-config', () => {
    const config = [{
      name: 'firebaserealtimedatabase',
      driver: 'firebaserealtimedatabase'
    }]

    const edmunds = new Edmunds(appRootPath.path)
    const manager = new CacheManager(edmunds, config)

    expect(() => manager.get()).to.throw('Firebase config variables are not available. Please use the latest version of the Firebase CLI to deploy this function.')
  })

  it('should have FirebaseRealtimeDatabase with custom-config', () => {
    const config = [{
      name: 'firebaserealtimedatabase',
      driver: 'firebaserealtimedatabase',
      databaseURL: 'https://totally-non-exisiting-project.impossible.firebaseio.com'
    }]

    const edmunds = new Edmunds(appRootPath.path)
    const manager = new CacheManager(edmunds, config)

    expect(() => manager.get()).to.throw('Invalid Firebase app options passed as the first argument to initializeApp() for the app named "firebaserealtimedatabase". The "credential" property must be an object which implements the Credential interface.')
  })

})
