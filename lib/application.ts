import {
  Express
} from 'express'
import * as express from 'express'

/**
 * Application class
 */
export class Application {
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
