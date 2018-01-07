import { NextFunction } from 'express'
import { Request } from './request'
import { Response } from './response'
import { BaseMiddleware } from '../support/basemiddleware'

/**
 * Controller class
 */
export abstract class Controller extends BaseMiddleware {
  /**
   * Get function to use as middleware
   * @param {string} method
   * @returns {(req: Request, res: Response, next: NextFunction) => void}
   */
  static func<T extends Controller> (method: string): (req: Request, res: Response, next: NextFunction) => void {
    return this.baseFunc(method)
  }
}
