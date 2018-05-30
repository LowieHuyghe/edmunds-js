import { NextFunction } from 'express'
import Middleware from '../http/middleware'

export default class ExitMiddleware extends Middleware {
  /**
   * Call the middleware
   * @param {any} params The given route params
   * @param {NextFunction} next The next middleware to call
   * @returns {void}
   */
  call (params: any, next: NextFunction): void {
    if (this.edmunds.isExiting()) {
      this.res.set('Connection', 'close')
      this.res.status(503).send('Server is in the process of restarting.')
    } else {
      next()
    }
  }
}
