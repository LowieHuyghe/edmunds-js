import Edmunds from '../edmunds'
import LoggingServiceProvider from './loggingserviceprovider'
import { expect } from 'chai'
import 'mocha'
import * as importFresh from 'import-fresh'
import * as appRootPath from 'app-root-path'
import { transports } from 'winston'

describe('loggingserviceprovider.ts', () => {

  it('should have logger', () => {
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
    edmunds.register(LoggingServiceProvider)
    expect(edmunds.logger).to.not.be.an('undefined')

    expect((edmunds.logger as any).level).to.equal('info')
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
    edmunds.config = importFresh('config')
    edmunds.register(LoggingServiceProvider)

    expect((edmunds.logger as any).level).to.equal('warn')
  })

})
