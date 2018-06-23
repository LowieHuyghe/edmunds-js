import Edmunds from '../edmunds'
import Middleware from './middleware'
import * as chai from 'chai'
import * as appRootPath from 'app-root-path'
import {
  Response,
  Request,
  NextFunction
} from 'express'
import 'mocha'
import ErrorMiddleware from './errormiddleware'

const chaiHttp = require('chai-http')
chai.use(chaiHttp)
const expect = chai.expect

describe('basemiddleware.js', () => {

  it('Should handle sync errors', (done) => {
    class MyMiddleware extends Middleware {
      call (params: any, next: NextFunction): void {
        throw new Error('SYNC ERROR!')
      }
    }

    class MyErrorMiddleware extends ErrorMiddleware {
      handle (err: Error, next: NextFunction): void {
        this.res.status(500).send('Error happened')
      }
    }

    const edmunds = new Edmunds(appRootPath.path)
    edmunds.app.use(MyMiddleware.func())
    edmunds.app.use('/', (req: Request, res: Response) => res.send('My Actual Response'))
    edmunds.app.use(MyErrorMiddleware.func())

    chai.request(edmunds.app).get('/').end((err: any, res: any) => {
      expect(err).to.be.a('null')
      expect(res.error).to.be.instanceof(Error)
      expect(res).to.have.status(500)
      expect(res.text).to.equal('Error happened')

      done()
    })
  })

  it('Should handle async errors', (done) => {
    class MyMiddleware extends Middleware {
      async call (params: any, next: NextFunction): Promise<void> {
        throw new Error('ASYNC ERROR!')
      }
    }

    class MyErrorMiddleware extends ErrorMiddleware {
      handle (err: Error, next: NextFunction): void {
        this.res.status(500).send('Error happened')
      }
    }

    const edmunds = new Edmunds(appRootPath.path)
    edmunds.app.use(MyMiddleware.func())
    edmunds.app.use('/', (req: Request, res: Response) => res.send('My Actual Response'))
    edmunds.app.use(MyErrorMiddleware.func())

    chai.request(edmunds.app).get('/').end((err: any, res: any) => {
      expect(err).to.be.a('null')
      expect(res.error).to.be.instanceof(Error)
      expect(res).to.have.status(500)
      expect(res.text).to.equal('Error happened')

      done()
    })
  })

})
