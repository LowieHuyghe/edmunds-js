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
        "databaseURL": "https://totally-non-exisiting-project.firebaseio.com"
      	// ...other firebase config mentioned in the docs
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
await edmunds.register(CacheServiceProvider)

// Usage
const result = await edmunds.cache().get('SomeKey')
await edmunds.cache('redis').set('SomeOtherKey', 'AWildValue', 60)
await edmunds.cache('firebaserealtimedatabase').del('YetAnotherKey')
```

Documentation can be found on the link at the top.
