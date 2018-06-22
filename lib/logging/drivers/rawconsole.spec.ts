import { RawConsole } from './rawconsole'
import * as sinon from 'sinon'
import { expect } from 'chai'
import { createLogger } from 'winston'

describe('rawconsole.ts', () => {

  it('should work', async () => {
    const logger = createLogger({
      transports: [
        new RawConsole({
          level: 'silly'
        })
      ]
    })

    const stubs: { [key: string]: sinon.SinonStub } = {}
    const levels = ['error', 'warn', 'info', 'debug', 'log']
    for (const level of levels) {
      const stub = sinon.stub(console, level as any)
      stub.withArgs(level).returns(undefined)
      stub.throws(`Should not get here with ${level}`)
      stubs[level] = stub
    }

    try {
      logger.error('error')
      expect(stubs.error.callCount).to.equal(1)
      expect(stubs.warn.callCount).to.equal(0)
      expect(stubs.info.callCount).to.equal(0)
      expect(stubs.debug.callCount).to.equal(0)
      expect(stubs.log.callCount).to.equal(0)

      logger.warn('warn')
      expect(stubs.error.callCount).to.equal(1)
      expect(stubs.warn.callCount).to.equal(1)
      expect(stubs.info.callCount).to.equal(0)
      expect(stubs.debug.callCount).to.equal(0)
      expect(stubs.log.callCount).to.equal(0)

      logger.info('info')
      expect(stubs.error.callCount).to.equal(1)
      expect(stubs.warn.callCount).to.equal(1)
      expect(stubs.info.callCount).to.equal(1)
      expect(stubs.debug.callCount).to.equal(0)
      expect(stubs.log.callCount).to.equal(0)

      logger.verbose('log')
      expect(stubs.error.callCount).to.equal(1)
      expect(stubs.warn.callCount).to.equal(1)
      expect(stubs.info.callCount).to.equal(1)
      expect(stubs.debug.callCount).to.equal(0)
      expect(stubs.log.callCount).to.equal(1)

      logger.silly('log')
      expect(stubs.error.callCount).to.equal(1)
      expect(stubs.warn.callCount).to.equal(1)
      expect(stubs.info.callCount).to.equal(1)
      expect(stubs.debug.callCount).to.equal(0)
      expect(stubs.log.callCount).to.equal(2)

      logger.http('log')
      expect(stubs.error.callCount).to.equal(1)
      expect(stubs.warn.callCount).to.equal(1)
      expect(stubs.info.callCount).to.equal(1)
      expect(stubs.debug.callCount).to.equal(0)
      expect(stubs.log.callCount).to.equal(3)

      logger.debug('debug')
      expect(stubs.error.callCount).to.equal(1)
      expect(stubs.warn.callCount).to.equal(1)
      expect(stubs.info.callCount).to.equal(1)
      expect(stubs.debug.callCount).to.equal(1)
      expect(stubs.log.callCount).to.equal(3)
    } finally {
      for (const level of levels) {
        stubs[level].restore()
      }
    }
  })

})
