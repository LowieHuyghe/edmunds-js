import { Edmunds } from '../edmunds'
import { CacheServiceProvider } from './cacheserviceprovider'
import { expect } from 'chai'
import 'mocha'
import * as importFresh from 'import-fresh'
import * as appRootPath from 'app-root-path'
import * as redis from 'redis'
import { CacheManager } from './cachemanager'

describe('cacheserviceprovider.ts', () => {

  it('should have cachemanager', async () => {
    const edmunds = new Edmunds(appRootPath.path)
    expect(edmunds.cacheManager).to.be.an('undefined')
    await edmunds.register(CacheServiceProvider)
    expect(edmunds.cacheManager).to.be.instanceof(CacheManager)
  })

  it('should have cachemanager with config', async () => {
    // Override config
    process.env.NODE_CONFIG = JSON.stringify({
      cache: {
        instances: [{
          name: 'redis',
          driver: 'redis',
          host: '192.168.123.123'
        }]
      }
    })
    const edmunds = new Edmunds(appRootPath.path)
    edmunds.config = importFresh('config')

    expect(edmunds.cacheManager).to.be.an('undefined')
    await edmunds.register(CacheServiceProvider)
    expect(edmunds.cacheManager).to.be.instanceof(CacheManager)

    expect(edmunds.cache()).to.be.an.instanceof(redis.RedisClient)
    expect(edmunds.cache('redis')).to.be.an.instanceof(redis.RedisClient)
    expect(edmunds.cacheManager.get()).to.be.an.instanceof(redis.RedisClient)
    expect(edmunds.cacheManager.get('redis')).to.be.an.instanceof(redis.RedisClient)
  })

})
