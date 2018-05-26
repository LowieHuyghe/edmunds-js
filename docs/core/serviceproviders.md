# Service Providers

Service Providers are a way of keeping the application as light as possible.
This is done by separating your application in modules and only loading the
modules you need.

Also the service providers make sure your application is loaded completely
when starting up. So no loading needs to be done while processing requests.


## Define

Define your Service Provider like so:

```typescript
import { ServiceProvider } from 'edmunds'

export default class MyServiceProvider extends ServiceProvider {
  /**
   * Register the service provider
   */
  async register (): Promise<void> {
    // Load in your module
  }
}
```


## Register

Register the Service Provider once it needs to be loaded:

```typescript
import * as appRootPath from 'app-root-path'
import { Edmunds } from 'edmunds'
import MyServiceProvider from './myserviceprovider'

const edmunds = new Edmunds(appRootPath.path)
await edmunds.register(MyServiceProvider)
```

This way the register-function of your Service Provider provider is called.
