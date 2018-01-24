import { Edmunds } from '../edmunds'
import { ErrorHandlerServiceProvider } from './errorhandlerserviceprovider'
import * as chai from 'chai'
import 'mocha'
import * as importFresh from 'import-fresh'
import { ErrorMiddleware } from '../http/errormiddleware'
import { NextFunction } from 'express'

const chaiHttp = require('chai-http')
chai.use(chaiHttp)
const expect = chai.expect

describe('errorhandlerserviceprovider.js', () => {

  it('should have no error handler view', (done) => {
    const edmunds = new Edmunds()

    edmunds.app.use('/', () => {
      throw new Error('Beautiful Exception!')
    })
    edmunds.app.use(MyErrorMiddleware.func())

    chai.request(edmunds.app).post('/').end((err: Error, res: any) => {
      expect(err).to.be.instanceof(Error)
      expect(res.text).to.include('MY HANDLER')
      expect(res.text).to.not.include('<style>')
      done()
    })
  })

  it('should have error handler view', (done) => {
    // Override config
    process.env.NODE_CONFIG = JSON.stringify({
      errorhandler: {
        type: 'json',
        options: {
          inflate: false
        }
      }
    })
    const edmunds = new Edmunds()
    edmunds.config = importFresh('config')

    edmunds.app.use('/', () => {
      throw new Error('Beautiful Exception!')
    })

    edmunds.register(ErrorHandlerServiceProvider)
    edmunds.app.use(MyErrorMiddleware.func())

    chai.request(edmunds.app).post('/').end((err: any, res: any) => {
      expect(err).to.be.instanceof(Error)
      expect(res.text).to.include('Beautiful Exception!')
      expect(res.text).to.include('<style>')
      done()
    })
  })

})

class MyErrorMiddleware extends ErrorMiddleware {
  handle (err: Error, next: NextFunction): void {
    this.res.status(500).send(`MY HANDLER`)
  }
}
