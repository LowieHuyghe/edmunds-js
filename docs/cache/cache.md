# Cache

Edmunds supports multiple caching systems by default:
- [Memcached](https://www.npmjs.com/package/memcached)
- [Redis](https://www.npmjs.com/package/redis)
- [Firebase Realtime Database](https://firebase.google.com/docs/database/web/start)

The last one is used as a cheap alternative to redis and memcache for
Firebase applications.


## Configuration

Example config:
```json
{
  "cache": {
    // Cache instances. As many as you like.
    "instances": [
      {
        // Unique name for this instance
        "name": "memcached", 
        // Name of the driver 
        "driver": "memcached",
        // Optional
      	"servers": "192.168.123.123:11211",
      	"maxKeySize": 200
      	// ...other memcached config mentioned in the docs
      },
      {
        "name": "redis",
        "driver": "redis",
        // Optional
        "host": "192.168.123.123"
      	// ...other redis config mentioned in the docs
      },
      {
        "name": "firebaserealtimedatabase",
        "driver": "firebaserealtimedatabase",
        // Optional
        // Custom name given to firebase app when initialized
        "appName": "customFirebaseAppName"
      }
    ]
  }
}
```


## Usage

Example usage:
```typescript
import * as appRootPath from 'app-root-path'
import {
  Edmunds,
  CacheServiceProvider
} from 'edmunds'

const edmunds = new Edmunds(appRootPath.path)

// Cache Service Provider
edmunds.register(CacheServiceProvider)

// Usage
const firstDriver = await edmunds.cache()
const result = await firstDriver.get('SomeKey')

const redisDriver = await edmunds.cache('redis')
await redisDriver.set('SomeOtherKey', 'AWildValue', 60)

const firebaseDriver = await edmunds.cache('firebaserealtimedatabase')
await firebaseDriver.del('YetAnotherKey')
```

Documentation can be found on the link at the top.
