import { Edmunds } from '../edmunds'
import { Middleware } from './middleware'
import * as chai from 'chai'
import * as appRootPath from 'app-root-path'
import {
  Response,
  Request,
  NextFunction
} from 'express'
import 'mocha'

const chaiHttp = require('chai-http')
chai.use(chaiHttp)
const expect = chai.expect

describe('middleware.js', () => {

  it('should work', (done) => {
    class MyMiddleware extends Middleware {
      static registerCount: number = 0

      call (params: any, next: NextFunction): void {
        ++MyMiddleware.registerCount
        if (MyMiddleware.registerCount === 2) {
          this.res.send('My Second Response')
        } else {
          next()
        }
      }

      secondaryCall (params: any, next: NextFunction): void {
        if (MyMiddleware.registerCount === 3) {
          this.res.send('My Third Response')
        } else {
          next()
        }
      }
    }

    const edmunds = new Edmunds(appRootPath.path)
    edmunds.app.use(MyMiddleware.func())
    edmunds.app.use(MyMiddleware.func('secondaryCall'))
    edmunds.app.use('/', (req: Request, res: Response) => {
      res.send('My First Response')
    })

    expect(MyMiddleware.registerCount).to.equal(0)

    chai.request(edmunds.app).get('/').end((err: any, res: any) => {
      expect(MyMiddleware.registerCount).to.equal(1)
      expect(err).to.be.a('null')
      expect(res).to.have.status(200)
      expect(res.text).to.equal('My First Response')

      chai.request(edmunds.app).get('/').end((err: any, res: any) => {
        expect(MyMiddleware.registerCount).to.equal(2)
        expect(err).to.be.a('null')
        expect(res).to.have.status(200)
        expect(res.text).to.equal('My Second Response')

        chai.request(edmunds.app).get('/').end((err: any, res: any) => {
          expect(MyMiddleware.registerCount).to.equal(3)
          expect(err).to.be.a('null')
          expect(res).to.have.status(200)
          expect(res.text).to.equal('My Third Response')

          done()
        })
      })
    })
  })

})
