# Request Input

Middleware (so Controllers too) are equipped with an
`input`-property. This property enables you to easily fetch and
validate the **query and body data**.

The `input`-property is an instance of `ObjectWrapper`. It has the
useful `get` and `has` methods, and can be used with
[joi](https://github.com/hapijs/joi) for validation.


## Usage

Use the `input`-property as followed:

```typescript
import {
  NextFunction
} from 'express'
import {
  ObjectWrapper,
  Controller
} from 'edmunds'
import * as Joi from 'joi'

export default class MyController extends Controller {
  /**
   * Get response without joi
   * @param {any} params The given route params
   * @param {NextFunction} next The next middleware to call
   * @returns {void}
   */
  getWithoutJoi (params: any, next: NextFunction): void {
    const name = this.input.has('name')
      ? this.input.get('name')
      : 'unknown'
    const surname = this.input.get('surname', 'unknown')
    const age = this.input.get('age')  // undefined if not set
    
    this.res.send(`Hello ${name} ${surname} (${age})!`)
  }
  /**
   * Get response with joi
   * @param {any} params The given route params
   * @param {NextFunction} next The next middleware to call
   * @returns {void}
   */
  getWithJoi (params: any, next: NextFunction): void {
    const result = this.input.validate(Joi.object.keys({
      name: Joi.string(),
      surname: Joi.string(),
      age: Joi.integer().min(16).max(120)
    }))
    
    if (result.error) {
      this.res.send('Input was invalid!')
    } else {
      this.res.send(`Hello ${result.value.name} ${result.value.surname} (${result.value.age})!`)
    }
  }
}
```

> Note: in order for form- or json-post-data to be available in
> `input`, `body-parser` will have to be defined as middleware. It
> converts the request-body to an object.
