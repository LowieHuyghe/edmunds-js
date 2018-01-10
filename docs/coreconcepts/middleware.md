
# Middleware

Middleware is the proper way of layering your application. This is a
basic class-implementation of a middleware-function and can be used
everywhere you would use a middleware-function.

More on expresjs.com: [Using middleware](http://expressjs.com/en/guide/using-middleware.html)

>Note: The Controller-class is based the same principle.


## Define

Define your Middleware like so:

```typescript
import {
  Application,
  NextFunction,
  Request,
  Response
} from 'express'
import {
  Edmunds,
  Middleware
} from 'edmunds'

export class MyMiddleware extends Middleware {
  /**
   * Call the middleware
   * @param {any} params The given route params
   * @param {NextFunction} next The next middleware to call
   * @returns {void}
   */
  call (params: any, next: NextFunction): void {
    // Do your thing!
    //   this.req: Request      Current request
    //   this.res: Response     Current response
    //   this.app: Application  Current express application
    //   this.edmunds: Edmunds  Current edmunds instance
    next()
  }
}
```


## Usage

Use the Middleware as followed:

```typescript
import { Edmunds } from 'edmunds'
import { MyMiddleware } from './mymiddleware'

const edmunds = new Edmunds()
edmunds.app.use(MyMiddleware.func())
```


## Error Middleware

Error Middleware have the same functionality, but are centralized
around error-handling. The only difference is the call-function
which gets the error instead of the route-params.

```typescript
import { NextFunction } from 'express'
import { ErrorMiddleware } from 'edmunds'

export class MyErrorMiddleware extends ErrorMiddleware {
  /**
   * Call the middleware
   * @param {Error} err The error
   * @param {NextFunction} next The next function to call
   * @returns {void}
   */
  call (err: Error, next: NextFunction): void {
    console.error(err.stack)
    this.res.status(500).send('Something broke!')
  }
}
```
