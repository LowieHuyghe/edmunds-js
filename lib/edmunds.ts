import * as express from 'express'
import { Request } from './http/request'
import { Response } from './http/response'
import { ServiceProvider } from './support/serviceprovider'

/**
 * Edmunds class
 */
export class Edmunds {
  /**
   * {Express}
   */
  public app: express.Application

  /**
   * Constructor
   */
  constructor () {
    this.app = express()
    this.app.use((req: Request, res: Response, next: express.NextFunction) => {
      req.edmunds = this
      next()
    })
  }

  /**
   * Register a service provider
   * @param {{new(edmunds: Edmunds): ServiceProvider}} GivenServiceProvider
   */
  register (GivenServiceProvider: new (app: Edmunds) => ServiceProvider) {
    const instance = new GivenServiceProvider(this)
    instance.register()
  }
}
