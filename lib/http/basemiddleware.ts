import {
  Application,
  NextFunction,
  Request,
  Response
} from 'express'
import { Edmunds } from '../edmunds'

/**
 * Base middleware class
 * Note: This class is not abstract because this() in static methods is not supported when the class is abstract
 */
export class BaseMiddleware {
  /**
   * Current express instance
   */
  protected app: Application

  /**
   * Current edmunds instance
   */
  protected edmunds: Edmunds

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
   * Constructor
   * @param {Request} req
   * @param {Response} res
   */
  protected constructor (req: Request, res: Response) {
    this.app = req.app
    this.edmunds = req.app.get('edmunds')
    this.req = this.request = req
    this.res = this.response = res
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

  /**
   * Get function to use as error-middleware
   * @param {string} method
   * @returns {(err: Error, req: Request, res: Response, next: NextFunction) => void}
   */
  protected static baseErrFunc<T extends BaseMiddleware> (method: string): (err: Error, req: Request, res: Response, next: NextFunction) => void {
    return (err: Error, req: Request, res: Response, next: NextFunction) => {
      // Instantiate the instance
      const instance = new this(req, res)
      // Get the correct method
      let instanceMethod = (instance as any)[method]
      // Bind context of instance
      instanceMethod = instanceMethod.bind(instance)
      // Call it
      instanceMethod(err, next)
    }
  }
}
