import {
  Application,
  NextFunction,
  Request,
  Response
} from 'express'
import Edmunds from '../edmunds'
import ObjectWrapper from '../support/objectwrapper'

/**
 * Base middleware class
 * Note: This class is not abstract because this() in static methods is not supported when the class is abstract
 */
export default class BaseMiddleware {
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
   * Current input
   */
  protected input: ObjectWrapper

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

    let inputData
    if (req.body instanceof Object) {
      inputData = { ...req.query, ...req.body }
    } else {
      inputData = { ...req.query }
    }
    this.input = new ObjectWrapper(inputData)
  }

  /**
   * Get function to use as middleware
   * @param {string} method
   * @returns {(req: Request, res: Response, next: NextFunction) => void}
   */
  protected static baseFunc<T extends BaseMiddleware> (method: string): (req: Request, res: Response, next: NextFunction) => void {
    return async (req: Request, res: Response, next: NextFunction) => {
      // Instantiate the instance
      const instance = new this(req, res)
      // Get the correct method
      let instanceMethod = (instance as any)[method]
      // Bind context of instance
      instanceMethod = instanceMethod.bind(instance)
      // Call it
      try {
        await instanceMethod(req.params, next)
      } catch (err) {
        next(err)
      }
    }
  }

  /**
   * Get function to use as error-middleware
   * @param {string} method
   * @returns {(err: Error, req: Request, res: Response, next: NextFunction) => void}
   */
  protected static baseErrFunc<T extends BaseMiddleware> (method: string): (err: Error, req: Request, res: Response, next: NextFunction) => void {
    return async (err: Error, req: Request, res: Response, next: NextFunction) => {
      // Instantiate the instance
      const instance = new this(req, res)
      // Get the correct method
      let instanceMethod = (instance as any)[method]
      // Bind context of instance
      instanceMethod = instanceMethod.bind(instance)
      // Call it
      try {
        await instanceMethod(err, next)
      } catch (err) {
        next(err)
      }
    }
  }
}
