import { Edmunds } from '../edmunds'
import { MethodOverrideServiceProvider } from './methodoverrideserviceprovider'
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

describe('methodoverrideserviceprovider.js', () => {

  it('should not find method', (done) => {
    const edmunds = new Edmunds()

    edmunds.app.delete('/', (req: Request, res: Response) => {
      res.send('Deleting something')
    })

    chai.request(edmunds.app).post('/')
      .set('X-HTTP-Method-Override', 'DELETE')
      .end((err: Error, res: any) => {
        expect(err.message).to.equal('Not Found')
        expect(res).to.have.status(404)
        done()
      })
  })

  it('should throw error when missing config', () => {
    const edmunds = new Edmunds()
    expect(() => {
      edmunds.register(MethodOverrideServiceProvider)
    }).to.throw('Configuration property "methodoverride.getter" is not defined')
  })

  it('should work properly', (done) => {
    // Override config
    process.env.NODE_CONFIG = JSON.stringify({
      methodoverride: {
        getter: 'X-HTTP-Method-Override'
      }
    })
    const edmunds = new Edmunds()
    edmunds.config = importFresh('config')
    edmunds.register(MethodOverrideServiceProvider)

    edmunds.app.delete('/', (req: Request, res: Response) => {
      res.send('DELETED!')
    })

    chai.request(edmunds.app).post('/')
      .set('X-HTTP-Method-Override', 'DELETE')
      .end((err: Error, res: any) => {
        expect(err).to.be.a('null')
        expect(res).to.have.status(200)
        expect(res.text).to.equal('DELETED!')
        done()
      })
  })

})
