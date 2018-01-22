import { Edmunds } from '../edmunds'
import { Controller } from './controller'
import * as chai from 'chai'
import {
  NextFunction
} from 'express'
import 'mocha'
import { ObjectWrapper } from '../support/objectwrapper'
import * as BodyParser from 'body-parser'

const chaiHttp = require('chai-http')
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

  it('should have input - empty', (done) => {
    class MyController extends Controller {
      static latestInput: ObjectWrapper = null

      getHelloWorld (params: any, next: NextFunction): void {
        MyController.latestInput = this.input
        next()
      }
    }

    const edmunds = new Edmunds()
    edmunds.app.use('/', MyController.func('getHelloWorld'))

    chai.request(edmunds.app).get('/').end(() => {
      expect(MyController.latestInput.data).to.deep.equal({})
      done()
    })
  })

  it('should have input - query and unparsed body', (done) => {
    class MyController extends Controller {
      static latestInput: ObjectWrapper = null

      getHelloWorld (params: any, next: NextFunction): void {
        MyController.latestInput = this.input
        next()
      }
    }

    const edmunds = new Edmunds()
    edmunds.app.use('/', MyController.func('getHelloWorld'))

    chai.request(edmunds.app).post('/?name=John&surname=Snow')
      .set('content-type', 'application/json')
      .send({ age: 33 })
      .end(() => {
        expect(MyController.latestInput.data).to.deep.equal({
          name: 'John',
          surname: 'Snow'
        })
        done()
      })
  })

  it('should have input - body and query', (done) => {
    class MyController extends Controller {
      static latestInput: ObjectWrapper = null

      getHelloWorld (params: any, next: NextFunction): void {
        MyController.latestInput = this.input
        next()
      }
    }

    const edmunds = new Edmunds()
    edmunds.app.use(BodyParser.json())
    edmunds.app.use('/', MyController.func('getHelloWorld'))

    chai.request(edmunds.app).post('/?name=John&surname=Snow')
      .set('content-type', 'application/json')
      .send({ age: 33 })
      .end(() => {
        expect(MyController.latestInput.data).to.deep.equal({
          name: 'John',
          surname: 'Snow',
          age: 33
        })
        done()
      })
  })

})
