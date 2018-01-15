import { Edmunds } from '../edmunds'
import { LoggingServiceProvider } from './loggingserviceprovider'
import { expect } from 'chai'
import 'mocha'
import * as importFresh from 'import-fresh'
import {
  Logger,
  transports
} from 'winston'

describe('loggingserviceprovider.ts', () => {

  it('should have no logger without config', () => {
    const edmunds = new Edmunds()
    expect(edmunds.logger).to.be.an('undefined')
    edmunds.register(LoggingServiceProvider)
    expect(edmunds.logger).to.be.an('undefined')
  })

  it('should have no logger when not enabled', () => {
    // set up config overrides so that calls to http services will fail fast
    process.env.NODE_CONFIG = JSON.stringify({
      logging: {
        enabled: false,
        instances: [{
          name: 'console',
          driver: 'Console'
        }]
      }
    })
    const edmunds = new Edmunds()
    edmunds.config = importFresh('config')

    expect(edmunds.logger).to.be.an('undefined')
    edmunds.register(LoggingServiceProvider)
    expect(edmunds.logger).to.be.an('undefined')
  })

  it('should have logger when enabled', () => {
    // Override config
    process.env.NODE_CONFIG = JSON.stringify({
      logging: {
        enabled: true,
        instances: [{
          name: 'console',
          driver: 'Console'
        }]
      }
    })
    const edmunds = new Edmunds()
    edmunds.config = importFresh('config')

    expect(edmunds.logger).to.be.an('undefined')
    edmunds.register(LoggingServiceProvider)
    expect(edmunds.logger).to.be.instanceof(Logger)

    expect(edmunds.logger.level).to.equal('info')
    expect(edmunds.logger.transports.console).to.not.be.a('undefined')
    expect(edmunds.logger.transports.console).to.be.instanceof(transports.Console)
  })

  it('should have logger options', () => {
    // Override config
    process.env.NODE_CONFIG = JSON.stringify({
      logging: {
        enabled: true,
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
    const edmunds = new Edmunds()
    edmunds.config = importFresh('config')
    edmunds.register(LoggingServiceProvider)

    expect(edmunds.logger.level).to.equal('warn')
  })

})
