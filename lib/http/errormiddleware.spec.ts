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
        if (MyErrorMiddleware.registerCount === 1) {
          this.res.status(500).send(`First ${err}`)
        } else {
          next(err)
        }
      }

      secondaryHandle (err: Error, next: NextFunction): void {
        if (MyErrorMiddleware.registerCount === 2) {
          this.res.status(500).send(`Second ${err}`)
        } else {
          next(err)
        }
      }
    }

    const edmunds = new Edmunds()
    edmunds.app.use('/', (req: Request, res: Response) => {
      throw new Error('This is an error')
    })
    edmunds.app.use(MyErrorMiddleware.func())
    edmunds.app.use(MyErrorMiddleware.func('secondaryHandle'))

    expect(MyErrorMiddleware.registerCount).to.equal(0)

    chai.request(edmunds.app).get('/').end((err: any, res: any) => {
      expect(MyErrorMiddleware.registerCount).to.equal(1)
      expect(err).to.not.be.a('null')
      expect(res).to.have.status(500)
      expect(res.text).to.equal('First Error: This is an error')

      chai.request(edmunds.app).get('/').end((err: any, res: any) => {
        expect(MyErrorMiddleware.registerCount).to.equal(2)
        expect(err).to.not.be.a('null')
        expect(res).to.have.status(500)
        expect(res.text).to.equal('Second Error: This is an error')

        done()
      })
    })
  })

})
