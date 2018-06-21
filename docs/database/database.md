# Database

Edmunds uses [typeorm](https://github.com/typeorm/typeorm) to manage
databases. TypeORM is an ORM which support most common databases,
has migrations, can run raw queries,...

The `DatabaseServiceProvider` is an easy way to load your connections
defined in `ormconfig.json`.  Use your edmunds-instance to easily
fetch one of the defined connections.

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
