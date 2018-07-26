# Environment

The current application environment can be easily fetched through
Edmunds. The environment is determined using `NODE_ENV` (defaulting
to `development` ). See [expressjs](https://expressjs.com/en/api.html#app.set).

```typescript
import * as appRootPath from 'app-root-path'
import { Edmunds } from 'edmunds'

const edmunds = new Edmunds(appRootPath.path)
const dev = edmunds.isDevelopment()  // NODE_ENV starting with `dev`
const stag = edmunds.isStaging()   // NODE_ENV starting with `stag`
const prod = edmunds.isProduction()   // NODE_ENV starting with `prod`
const test = edmunds.isTesting()   // NODE_ENV starting with `test`
```
