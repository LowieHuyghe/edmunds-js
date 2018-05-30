# Database

Edmunds uses [typeorm](https://github.com/typeorm/typeorm) to manage
databases. TypeORM is an ORM which support most common databases,
has migrations, can run raw queries,...

The `DatabaseServiceProvider` is an easy way to load your connections
defined in `ormconfig.json`. 


## Configuration

Instead of using the `ormconfig.json`, the database configuration is
defined with the other configuration. The configuration of each
instance is the same as you would define them in `ormconfig.json`.

Example config:
```json
{
  "database": {
    // Database instances. As many as you like.
    "instances": [
		{
			"name": "default",
			"type": "sqljs"
		}
	]
  }
}
```

> Note: Calling `edmunds.database()` without any name will return
the first instance in the list. Not the instance with no name or the
name `default` as would `getConnection()` do.


## Usage

Use your edmunds-instance to easily fetch one of the defined
connections.

```typescript
import * as appRootPath from 'app-root-path'
import {
  Edmunds,
  DatabaseServiceProvider
} from 'edmunds'

const edmunds = new Edmunds(appRootPath.path)

await edmunds.register(DatabaseServiceProvider)

const defaultConnection = await edmunds.database()
const secondConnection = await edmunds.database('database2')
```

Further documentation on how to defined entities, define migrations,
query data,... can be found on the
[typeorm-repo](https://github.com/typeorm/typeorm).
