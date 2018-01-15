import { Edmunds } from '../edmunds'
import { LoggingServiceProvider } from './loggingserviceprovider'
import { expect } from 'chai'
import 'mocha'
import * as importFresh from 'import-fresh'
import {
  Logger,
  transports
} from 'winston'
import * as sinon from 'sinon'

describe('loggingserviceprovider.ts', () => {
  const consoleMethods = ['log', 'info', 'warn', 'error', 'debug']

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

    const originalConsole: any = {}
    for (let method of consoleMethods) {
      originalConsole[method] = (console as any)[method]
    }

    expect(edmunds.logger).to.be.an('undefined')
    edmunds.register(LoggingServiceProvider)
    expect(edmunds.logger).to.be.instanceof(Logger)

    expect(edmunds.logger.level).to.equal('info')
    expect(edmunds.logger.transports.console).to.not.be.a('undefined')
    expect(edmunds.logger.transports.console).to.be.instanceof(transports.Console)
    for (let method of consoleMethods) {
      expect(originalConsole[method]).to.equal((console as any)[method])
    }
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

  it('should not override console', () => {
    // Override config
    process.env.NODE_CONFIG = JSON.stringify({
      logging: {
        enabled: true,
        overrideConsole: false,
        instances: [{
          name: 'console',
          driver: 'Console'
        }]
      }
    })
    const edmunds = new Edmunds()
    edmunds.config = importFresh('config')

    const originalConsole: any = {}
    for (let method of consoleMethods) {
      originalConsole[method] = (console as any)[method]
    }

    expect(edmunds.logger).to.be.an('undefined')
    edmunds.register(LoggingServiceProvider)
    expect(edmunds.logger).to.be.instanceof(Logger)

    expect(edmunds.logger.level).to.equal('info')
    expect(edmunds.logger.transports.console).to.not.be.a('undefined')
    expect(edmunds.logger.transports.console).to.be.instanceof(transports.Console)
    for (let method of consoleMethods) {
      expect(originalConsole[method]).to.equal((console as any)[method])
    }
  })

  it('should override console', () => {
    // Override config
    process.env.NODE_CONFIG = JSON.stringify({
      logging: {
        enabled: true,
        overrideConsole: true,
        instances: [{
          name: 'console',
          driver: 'Console'
        }]
      }
    })
    const edmunds = new Edmunds()
    edmunds.config = importFresh('config')

    const originalConsole: any = {}
    for (let method of consoleMethods) {
      originalConsole[method] = (console as any)[method]
    }

    const overriddenConsole = { ...originalConsole }
    try {
      edmunds.register(LoggingServiceProvider)
      for (let method of consoleMethods) {
        overriddenConsole[method] = (console as any)[method]
      }
    } finally {
      for (let method of consoleMethods) {
        (console as any)[method] = originalConsole[method]
      }
    }

    for (let method of consoleMethods) {
      expect(overriddenConsole[method]).to.not.equal(originalConsole[method])
    }

    // Stub and check methods
    const anyLogger: any = edmunds.logger
    for (let method of consoleMethods) {
      const loggerMethod = method === 'log' ? 'verbose' : method

      anyLogger[loggerMethod] = sinon.stub()
      overriddenConsole[method]('This is a message')
      expect(anyLogger[loggerMethod].called, method).to.equal(true)
    }
  })

})
