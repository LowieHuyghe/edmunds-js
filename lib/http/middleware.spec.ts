import { Edmunds } from '../edmunds'
import { Middleware } from './middleware'
import * as chai from 'chai'
import * as chaiHttp from 'chai-http'
import {
  Response,
  Request,
  NextFunction
} from 'express'
import 'mocha'
chai.use(chaiHttp)
const expect = chai.expect

describe('middleware.js', () => {

  it('should work', (done) => {
    class MyMiddleware extends Middleware {
      static registerCount: number = 0

      call (params: any, next: NextFunction): void {
        ++MyMiddleware.registerCount
        if (MyMiddleware.registerCount !== 1) {
          this.res.send('My Response')
        }
        next()
      }
    }

    const edmunds = new Edmunds()
    edmunds.app.use(MyMiddleware.func())
    edmunds.app.use('/', (req: Request, res: Response) => {
      if (MyMiddleware.registerCount === 1) {
        res.send('My First Response')
      }
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
        expect(res.text).to.equal('My Response')

        done()
      })
    })
  })

})
