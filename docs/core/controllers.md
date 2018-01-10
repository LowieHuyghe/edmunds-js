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
    //   this.req: Request      Current request
    //   this.res: Response     Current response
    //   this.app: Application  Current express application
    //   this.edmunds: Edmunds  Current edmunds instance
    this.res.send('Hello World!')
  }
}
```


## Usage

Use the Controller as followed:

```typescript
import { Edmunds } from 'edmunds'
import { MyController } from './mycontroller'

const edmunds = new Edmunds()
edmunds.app.use('/', MyController.func('getHelloWorld'))
```
