import {
  NextFunction,
  Request,
  Response
} from 'express'
import { BaseMiddleware } from './basemiddleware'

/**
 * Middleware class
 */
export abstract class Middleware extends BaseMiddleware {
  /**
   * Get function to use as middleware
   * @param {string} method
   * @returns {(req: Request, res: Response, next: NextFunction) => any}
   */
  static func<T extends Middleware> (method: string = 'call'): (req: Request, res: Response, next: NextFunction) => any {
    return this.baseFunc(method)
  }

  /**
   * Call the middleware
   * @param {any} params The given route params
   * @param {NextFunction} next The next middleware to call
   * @returns {void}
   */
  abstract call (params: any, next: NextFunction): void
}
