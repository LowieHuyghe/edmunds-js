import {
  default as express,
  Express
} from 'express'

/**
 * Application class
 */
export default class Application {
  /**
   * {Express}
   */
  public express: Express

  /**
   * Constructor
   */
  constructor () {
    this.express = express()
  }
}
