import { Edmunds } from '../edmunds'
import { ErrorMiddleware } from './errormiddleware'
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

describe('errormiddleware.js', () => {

  it('should work', (done) => {
    class MyErrorMiddleware extends ErrorMiddleware {
      static registerCount: number = 0

      handle (err: Error, next: NextFunction): void {
        ++MyErrorMiddleware.registerCount
        this.res.send(`${err}`)
      }
    }

    const edmunds = new Edmunds()
    edmunds.app.use('/', (req: Request, res: Response) => {
      throw new Error('This is an error')
    })
    edmunds.app.use(MyErrorMiddleware.func())

    expect(MyErrorMiddleware.registerCount).to.equal(0)

    chai.request(edmunds.app).get('/').end((err: any, res: any) => {
      expect(MyErrorMiddleware.registerCount).to.equal(1)
      expect(err).to.be.a('null')
      expect(res).to.have.status(200)
      expect(res.text).to.equal('Error: This is an error')

      done()
    })
  })

})
