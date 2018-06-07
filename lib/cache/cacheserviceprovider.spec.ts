import Edmunds from '../edmunds'
import CacheServiceProvider from './cacheserviceprovider'
import { expect } from 'chai'
import 'mocha'
import * as importFresh from 'import-fresh'
import * as appRootPath from 'app-root-path'
import CacheManager from './cachemanager'
import Redis from './drivers/redis'

describe('cacheserviceprovider.ts', () => {

  it('should have cachemanager', async () => {
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

    expect(edmunds.app.get('edmunds-cache-manager')).to.be.an('undefined')
    await edmunds.register(CacheServiceProvider)
    expect(edmunds.app.get('edmunds-cache-manager')).to.be.instanceof(CacheManager)

    try {
      expect(await edmunds.cache()).to.be.an.instanceof(Redis)
      expect(await edmunds.cache('redis')).to.be.an.instanceof(Redis)
      expect(await edmunds.app.get('edmunds-cache-manager').get()).to.be.an.instanceof(Redis)
      expect(await edmunds.app.get('edmunds-cache-manager').get('redis')).to.be.an.instanceof(Redis)
    } finally {
      (await edmunds.app.get('edmunds-cache-manager').get() as Redis).redis.end(false)
    }
  })

})
