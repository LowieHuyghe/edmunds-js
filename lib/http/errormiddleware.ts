import {
  NextFunction,
  Request,
  Response
} from 'express'
import { BaseMiddleware } from './basemiddleware'

/**
 * ErrorMiddleware class
 */
export abstract class ErrorMiddleware extends BaseMiddleware {
  /**
   * Get function to use as error-middleware
   * @returns {(err: Error, req: Request, res: Response, next: NextFunction) => any}
   */
  static func<T extends ErrorMiddleware> (): (err: Error, req: Request, res: Response, next: NextFunction) => any {
    return this.baseErrFunc('call')
  }

  /**
   * Call the middleware
   * @param {Error} err The error
   * @param {NextFunction} next The next middleware to call
   * @returns {void}
   */
  abstract call (err: Error, next: NextFunction): void
}
