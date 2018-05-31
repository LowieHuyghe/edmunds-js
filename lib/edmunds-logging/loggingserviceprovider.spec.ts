import Edmunds from '../edmunds/edmunds'
import LoggingServiceProvider from './loggingserviceprovider'
import { expect } from 'chai'
import 'mocha'
import * as importFresh from 'import-fresh'
import * as appRootPath from 'app-root-path'
import {
  Logger,
  transports,
  LoggerInstance
} from 'winston'

describe('loggingserviceprovider.ts', () => {

  it('should have no logger without config', async () => {
    const edmunds = new Edmunds(appRootPath.path)
    expect(edmunds.logger).to.be.an('undefined')
    await edmunds.register(LoggingServiceProvider)
    expect(edmunds.logger).to.be.instanceof(Logger)
    expect(Object.keys((edmunds.logger as LoggerInstance).transports).length).to.equal(0)
  })

  it('should have logger', async () => {
    // Override config
    process.env.NODE_CONFIG = JSON.stringify({
      logging: {
        instances: [{
          name: 'console',
          driver: 'Console'
        }]
      }
    })
    const edmunds = new Edmunds(appRootPath.path)
    edmunds.config = importFresh('config')

    expect(edmunds.logger).to.be.an('undefined')
    await edmunds.register(LoggingServiceProvider)
    expect(edmunds.logger).to.be.instanceof(Logger)

    expect((edmunds.logger as LoggerInstance).level).to.equal('info')
    expect((edmunds.logger as LoggerInstance).transports.console).to.not.be.a('undefined')
    expect((edmunds.logger as LoggerInstance).transports.console).to.be.instanceof(transports.Console)
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
    edmunds.config = importFresh('config')
    await edmunds.register(LoggingServiceProvider)

    expect((edmunds.logger as LoggerInstance).level).to.equal('warn')
  })

})
