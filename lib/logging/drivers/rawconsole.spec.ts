import { RawConsole } from './rawconsole'
import * as sinon from 'sinon'
import { expect } from 'chai'
import { createLogger } from 'winston'

describe('rawconsole.ts', () => {

  it('should work', async () => {
    const logger = createLogger({
      levels: { // Combination of npm and syslog levels
        error: 0,
        emerg: 1,
        alert: 2,
        crit: 3,
        warn: 4,
        warning: 5,
        info: 6,
        notice: 7,
        verbose: 8,
        debug: 9,
        silly: 10,
        http: 11,
        data: 12
      },
      transports: [
        new RawConsole({
          level: 'data'
        })
      ]
    })

    const stubs: { [key: string]: sinon.SinonStub } = {}
    const methods = ['error', 'warn', 'info', 'debug', 'log']
    for (const method of methods) {
      const stub = sinon.stub(console, method as any)
      stub.withArgs(method).returns(undefined)
      stub.throws(`Should not get here with ${method}`)
      stubs[method] = stub
    }

    try {
      const levelsAndMethods: { [key: string]: string } = {
        error: 'error',
        emerg: 'error',
        alert: 'error',
        crit: 'error',
        warn: 'warn',
        warning: 'warn',
        info: 'info',
        notice: 'info',
        verbose: 'log',
        debug: 'debug',
        silly: 'debug',
        http: 'debug',
        data: 'debug'
      }

      const methodCount: { [key: string]: number } = {}
      for (const method of methods) {
        methodCount[method] = 0
      }

      for (const level of Object.keys(levelsAndMethods)) {
        const method = levelsAndMethods[level]
        let loggerLevelMethod = (logger as any)[level]
        loggerLevelMethod = loggerLevelMethod.bind(logger)
        loggerLevelMethod(method)
        ++methodCount[method]

        for (const method of methods) {
          expect(stubs[method].callCount).to.equal(methodCount[method], `expected ${stubs[method].callCount} to equal ${methodCount[method]} for method "${method}" after level "${level}"`)
        }
      }
    } finally {
      for (const level of methods) {
        stubs[level].restore()
      }
    }
  })

})
