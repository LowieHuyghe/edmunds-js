import Edmunds from '../edmunds'
import LoggingServiceProvider from './loggingserviceprovider'
import 'mocha'
import * as appRootPath from 'app-root-path'
import { transports } from 'winston'
import * as chai from 'chai'
import * as chaiAsPromised from 'chai-as-promised'

chai.use(chaiAsPromised)
const expect = chai.expect

describe('loggingserviceprovider.ts', () => {

  it('should have logger multiple', () => {
    // Override config
    process.env.NODE_CONFIG = JSON.stringify({
      logging: {
        instances: [{
          name: 'console1',
          driver: 'Console'
        }, {
          name: 'console2',
          driver: 'Console'
        }]
      }
    })
    const edmunds = new Edmunds(appRootPath.path)
    delete require.cache[require.resolve('config')]
    edmunds.config = require('config')

    expect(edmunds.logger).to.be.an('undefined')
    edmunds.register(LoggingServiceProvider)
    expect(edmunds.logger).to.not.be.an('undefined')

    expect((edmunds.logger as any).level).to.equal('info')
    expect((edmunds.logger as any).transports.length).to.equal(2)
    expect((edmunds.logger as any).transports[0]).to.not.be.a('undefined')
    expect((edmunds.logger as any).transports[0]).to.be.instanceof(transports.Console)
    expect((edmunds.logger as any).transports[1]).to.not.be.a('undefined')
    expect((edmunds.logger as any).transports[1]).to.be.instanceof(transports.Console)
  })

  it('should have logger single', () => {
    // Override config
    process.env.NODE_CONFIG = JSON.stringify({
      logging: {
        instance: {
          name: 'console1',
          driver: 'Console'
        },
        instances: [{
          name: 'console2',
          driver: 'Console'
        }, {
          name: 'console3',
          driver: 'Console'
        }]
      }
    })
    const edmunds = new Edmunds(appRootPath.path)
    delete require.cache[require.resolve('config')]
    edmunds.config = require('config')

    expect(edmunds.logger).to.be.an('undefined')
    edmunds.register(LoggingServiceProvider)
    expect(edmunds.logger).to.not.be.an('undefined')

    expect((edmunds.logger as any).level).to.equal('info')
    expect((edmunds.logger as any).transports.length).to.equal(1)
    expect((edmunds.logger as any).transports[0]).to.not.be.a('undefined')
    expect((edmunds.logger as any).transports[0]).to.be.instanceof(transports.Console)
  })

  it('should have logger options', async () => {
    // Override config
    process.env.NODE_CONFIG = JSON.stringify({
      logging: {
        logger: {
          handleExceptions: true,
          level: 'warn',
          exitOnError: false
        },
        instances: [{
          name: 'console',
          driver: 'Console'
        }]
      }
    })
    const edmunds = new Edmunds(appRootPath.path)
    delete require.cache[require.resolve('config')]
    edmunds.config = require('config')
    edmunds.register(LoggingServiceProvider)

    expect((edmunds.logger as any).level).to.equal('warn')
  })

})
