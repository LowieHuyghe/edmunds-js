import { Edmunds } from '../edmunds'
import { Controller } from './controller'
import * as chai from 'chai'
import * as chaiHttp from 'chai-http'
import {
  NextFunction
} from 'express'
import 'mocha'
chai.use(chaiHttp)
const expect = chai.expect

describe('controller.js', () => {

  it('should work', (done) => {
    class MyController extends Controller {
      static registerCount: number = 0

      getHelloWorld (params: any, next: NextFunction): void {
        ++MyController.registerCount
        if (MyController.registerCount === 1) {
          this.res.send('First Hello World!')
        } else {
          this.res.send('Hello World!')
        }
        next()
      }
    }

    const edmunds = new Edmunds()
    edmunds.app.use('/', MyController.func('getHelloWorld'))

    expect(MyController.registerCount).to.equal(0)

    chai.request(edmunds.app).get('/').end((err: any, res: any) => {
      expect(MyController.registerCount).to.equal(1)
      expect(err).to.be.a('null')
      expect(res).to.have.status(200)
      expect(res.text).to.equal('First Hello World!')

      chai.request(edmunds.app).get('/').end((err: any, res: any) => {
        expect(MyController.registerCount).to.equal(2)
        expect(err).to.be.a('null')
        expect(res).to.have.status(200)
        expect(res.text).to.equal('Hello World!')

        done()
      })
    })
  })

})
