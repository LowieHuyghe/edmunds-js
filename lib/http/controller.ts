import { Application } from '../application'
import Constructor from '../foundation/staticconstructor'
import {
  Request,
  Response,
  NextFunction
} from 'express'

export class Controller {
  /**
   * The current application
   */
  public app: Application

  /**
   * Constructor
   * @param {Application} app
   */
  constructor (app: Application) {
    this.app = app
  }

  /**
   * Route function
   * @param {string} method
   * @returns {(req: Request, res: Response, next: NextFunction) => any}
   */
  static route<T extends Controller> (this: Constructor<T>, method: string): (req: Request, res: Response, next: NextFunction) => any {
    return (req: Request, res: Response, next: NextFunction) => {
      const controller = new this()
      const controllerMethod = (controller as any)[method]
      return controllerMethod(req, res, next)
    }
  }
}
