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
   * @returns {(req: Request, res: Response, next: NextFunction) => any}
   */
  static func<T extends Middleware> (): (req: Request, res: Response, next: NextFunction) => any {
    return this.baseFunc('call')
  }

  /**
   * Call the middleware
   * @param {any} params The given route params
   * @param {NextFunction} next The next middleware to call
   * @returns {void}
   */
  abstract call (params: any, next: NextFunction): void
}
