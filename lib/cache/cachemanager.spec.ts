import Edmunds from '../edmunds'
import CacheManager from './cachemanager'
import FirebaseRealtimeDatabase from './drivers/firebaserealtimedatabase'
import Memcached from './drivers/memcached'
import Redis from './drivers/redis'
import * as chai from 'chai'
import * as appRootPath from 'app-root-path'
import 'mocha'
import * as memcached from 'memcached'
import * as redis from 'redis'
import * as firebaseAdmin from 'firebase-admin'

const chaiAsPromised = require('chai-as-promised')
chai.use(chaiAsPromised)
const expect = chai.expect

describe('CacheManager', () => {
  afterEach(async () => {
    let app
    try {
      app = firebaseAdmin.app()
    } catch (e) {
      // Throws error if default app does not exist
    }
    if (app) {
      await app.delete()
    }
  })

  it('should have Redis', async () => {
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

    try {
      expect(await manager.get()).to.be.an.instanceof(Redis)
      expect(await manager.get('redis')).to.be.an.instanceof(Redis)
    } finally {
      (await manager.get() as Redis).redis.end(false)
    }
  })

  it('should throw error when instantiating Memcached without servers', async () => {
    const config = [{
      name: 'memcached',
      driver: 'memcached'
    }]

    const edmunds = new Edmunds(appRootPath.path)
    const manager = new CacheManager(edmunds, config)

    await expect(manager.get()).to.be.rejectedWith("'servers'-config is missing for cache-instance 'memcached'")
  })

  it('should have Memcached', async () => {
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

    try {
      expect(await manager.get()).to.be.an.instanceof(Memcached)
      expect(await manager.get('memcached')).to.be.an.instanceof(Memcached)
    } finally {
      (await manager.get() as Memcached).memcached.end()
    }
  })

  it('should have FirebaseRealtimeDatabase', async () => {
    const config = [{
      name: 'firebaserealtimedatabase',
      driver: 'firebaserealtimedatabase'
    }]

    firebaseAdmin.initializeApp({
      databaseURL: `https://totally-non-exisiting-project-${Math.round(Math.random() * 1000000)}.firebaseio.com`
    })

    const edmunds = new Edmunds(appRootPath.path)
    const manager = new CacheManager(edmunds, config)

    const driver = await manager.get()
    expect(driver).instanceof(FirebaseRealtimeDatabase)
  })

})
