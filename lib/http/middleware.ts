import { NextFunction } from 'express'
import { Request } from './request'
import { Response } from './response'
import { BaseMiddleware } from '../support/basemiddleware'

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
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @returns {void}
   */
  abstract call (req: Request, res: Response, next: NextFunction): void
}
