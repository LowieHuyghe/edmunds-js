import { Edmunds } from '../edmunds'
import { BodyParserServiceProvider } from './bodyparserserviceprovider'
import * as chai from 'chai'
import {
  Request,
  Response
} from 'express'
import 'mocha'
import * as importFresh from 'import-fresh'

const chaiHttp = require('chai-http')
chai.use(chaiHttp)
const expect = chai.expect

describe('bodyparserserviceprovider.js', () => {

  it('should have no object body', (done) => {
    const edmunds = new Edmunds()

    let postData: any
    edmunds.app.use('/', (req: Request, res: Response) => {
      postData = req.body
      res.send('')
    })

    chai.request(edmunds.app).post('/')
      .set('content-type', 'application/json')
      .send({ age: 33 })
      .end(() => {
        expect(postData).to.be.a('undefined')
        done()
      })
  })

  it('should throw error when missing config', () => {
    const edmunds = new Edmunds()
    expect(() => {
      edmunds.register(BodyParserServiceProvider)
    }).to.throw('Configuration property "bodyparser.type" is not defined')
  })

  it('should throw error when using non-existing type', () => {
    // Override config
    process.env.NODE_CONFIG = JSON.stringify({
      bodyparser: {
        type: 'imaginary'
      }
    })
    const edmunds = new Edmunds()
    edmunds.config = importFresh('config')
    expect(() => {
      edmunds.register(BodyParserServiceProvider)
    }).to.throw('"imaginary" is not a valid body-parser-type')
  })

  it('should work properly', (done) => {
    // Override config
    process.env.NODE_CONFIG = JSON.stringify({
      bodyparser: {
        type: 'json',
        options: {
          inflate: false
        }
      }
    })
    const edmunds = new Edmunds()
    edmunds.config = importFresh('config')
    edmunds.register(BodyParserServiceProvider)

    let postData: any
    edmunds.app.use('/', (req: Request, res: Response) => {
      postData = req.body
      res.send('')
    })

    chai.request(edmunds.app).post('/')
      .set('content-type', 'application/json')
      .send({ age: 33 })
      .end(() => {
        expect(postData).to.deep.equal({
          age: 33
        })
        done()
      })
  })

})
