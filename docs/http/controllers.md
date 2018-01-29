# Controllers

Controllers work the same way middleware does, but can have multiple
methods.


## Define

Define your Controller like so:

```typescript
import {
  Application,
  NextFunction,
  Request,
  Response
} from 'express'
import {
  Edmunds,
  ObjectWrapper,
  Controller
} from 'edmunds'

export class MyController extends Controller {
  /**
   * Call the controller
   * @param {any} params The given route params
   * @param {NextFunction} next The next middleware to call
   * @returns {void}
   */
  getHelloWorld (params: any, next: NextFunction): void {
    // Do your thing!
    //   this.req: Request          Current request
    //   this.res: Response         Current response
    //   this.app: Application      Current express application
    //   this.edmunds: Edmunds      Current edmunds instance
    //   this.input: ObjectWrapper  Current query and body input
    this.res.send('Hello World!')
  }
}
```


## Usage

Use the Controller as followed:

```typescript
import * as appRootPath from 'app-root-path'
import { Edmunds } from 'edmunds'
import { MyController } from './mycontroller'

const edmunds = new Edmunds(appRootPath.path)
edmunds.app.use('/', MyController.func('getHelloWorld'))
```
