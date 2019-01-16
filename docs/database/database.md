# Database

Edmunds uses [typeorm](https://github.com/typeorm/typeorm) to manage
databases. TypeORM is an ORM which support most common databases,
has migrations, can run raw queries,...


## Configuration

The configuration of typeorm which is otherwise defined in
`ormconfig.json/js/...` is now defined with the rest of the config
under `database > instances`.

Example config:
```json
{
  "database": {
    // TypeORM instances. As many as you like.
    "instances": [
      {
        "name": "default",
        "type": "mysql",
        "host": "localhost",
        "port": 3306,
        "username": "test",
        "password": "test",
        "database": "test"
      },
      {
        "name": "second-connection",
        "type": "mysql",
        "host": "localhost",
        "port": 3306,
        "username": "test",
        "password": "test",
        "database": "test"
      }
    ]
  }
}
```


## Usage

The `DatabaseServiceProvider` is an easy way to load your connections
defined in the config. Use your edmunds-instance to easily fetch one
of the defined connections.

```typescript
import * as appRootPath from 'app-root-path'
import {
  Edmunds,
  DatabaseServiceProvider
} from 'edmunds'

const edmunds = new Edmunds(appRootPath.path)

edmunds.register(DatabaseServiceProvider)

const defaultConnection = await edmunds.database()
const secondConnection = await edmunds.database('second-connection')
```

### Cli

As the typeorm-cli gets it's config from the `ormconfig.json/js/...`
file in the root there will have to be a replacement file that reads
our config.

```javascript
// ormconfig.js

const config = require('config')

let instances = []
if (config.has('database.instance')) {
  instances = [config.get('database.instance')]
} else if (config.has('database.instances')) {
  instances = config.get('database.instances')
}

module.exports = instances
```

Further documentation on how to defined entities, define migrations,
query data,... can be found on the
[typeorm-repo](https://github.com/typeorm/typeorm).
