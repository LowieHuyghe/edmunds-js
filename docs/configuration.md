# Configuration

Edmunds is equipped with an instance of
[node-config](https://github.com/lorenwest/node-config) used for
configuring the application.

```typescript
import { Edmunds } from 'edmunds'

const edmunds = new Edmunds()
const appName = edmunds.config.get('app.name')
```

Documentation can be found on the
[node-config-wiki](https://github.com/lorenwest/node-config/wiki).
