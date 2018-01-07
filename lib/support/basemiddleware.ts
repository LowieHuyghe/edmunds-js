import { Application } from 'express'
import { NextFunction } from 'express'
import { Request } from '../http/request'
import { Response } from '../http/response'
import { Edmunds } from '../edmunds'

/**
 * Base middleware class
 * Note: This class is not abstract because this() in static methods is not supported when the class is abstract
 */
export class BaseMiddleware {
  /**
   * Current request
   */
  protected req: Request
  protected request: Request

  /**
   * Current response
   */
  protected res: Response
  protected response: Response

  /**
   * Current express instance
   */
  protected app: Application

  /**
   * Current edmunds instance
   */
  protected edmunds: Edmunds

  /**
   * Constructor
   * @param {Request} req
   * @param {Response} res
   */
  protected constructor (req: Request, res: Response) {
    this.req = this.request = req
    this.res = this.response = res
    this.app = this.req.app
    this.edmunds = this.req.edmunds
  }

  /**
   * Get function to use as middleware
   * @param {string} method
   * @returns {(req: Request, res: Response, next: NextFunction) => void}
   */
  protected static baseFunc<T extends BaseMiddleware> (method: string): (req: Request, res: Response, next: NextFunction) => void {
    return (req: Request, res: Response, next: NextFunction) => {
      // Instantiate the instance
      const instance = new this(req, res)
      // Get the correct method
      let instanceMethod = (instance as any)[method]
      // Bind context of instance
      instanceMethod = instanceMethod.bind(instance)
      // Call it
      instanceMethod(req.params, next)
    }
  }
}
