import { RawConsole } from './rawconsole'
import { LEVEL, MESSAGE } from 'triple-beam'
import * as sinon from 'sinon'
import { expect } from 'chai'

describe('rawconsole.ts', () => {

  it('should work', async () => {
    const transport = new RawConsole({})

    const stubs: { [key: string]: sinon.SinonStub } = {}
    const levels = ['error', 'warn', 'info', 'debug', 'log']
    for (const level of levels) {
      const stub = sinon.stub(console, level as any)
      stub.withArgs(level).returns(undefined)
      stub.throws('Should not get here')
      stubs[level] = stub
    }

    try {
      transport.log({ [LEVEL]: 'error', [MESSAGE]: 'error' }, () => undefined)
      expect(stubs.error.calledOnce).to.equal(true)
      expect(stubs.warn.notCalled).to.equal(true)
      expect(stubs.info.notCalled).to.equal(true)
      expect(stubs.debug.notCalled).to.equal(true)
      expect(stubs.log.notCalled).to.equal(true)

      transport.log({ [LEVEL]: 'warn', [MESSAGE]: 'warn' }, () => undefined)
      expect(stubs.error.calledOnce).to.equal(true)
      expect(stubs.warn.calledOnce).to.equal(true)
      expect(stubs.info.notCalled).to.equal(true)
      expect(stubs.debug.notCalled).to.equal(true)
      expect(stubs.log.notCalled).to.equal(true)

      transport.log({ [LEVEL]: 'info', [MESSAGE]: 'info' }, () => undefined)
      expect(stubs.error.calledOnce).to.equal(true)
      expect(stubs.warn.calledOnce).to.equal(true)
      expect(stubs.info.calledOnce).to.equal(true)
      expect(stubs.debug.notCalled).to.equal(true)
      expect(stubs.log.notCalled).to.equal(true)

      transport.log({ [LEVEL]: 'debug', [MESSAGE]: 'debug' }, () => undefined)
      expect(stubs.error.calledOnce).to.equal(true)
      expect(stubs.warn.calledOnce).to.equal(true)
      expect(stubs.info.calledOnce).to.equal(true)
      expect(stubs.debug.calledOnce).to.equal(true)
      expect(stubs.log.notCalled).to.equal(true)

      transport.log({ [LEVEL]: 'log', [MESSAGE]: 'log' }, () => undefined)
      expect(stubs.error.calledOnce).to.equal(true)
      expect(stubs.warn.calledOnce).to.equal(true)
      expect(stubs.info.calledOnce).to.equal(true)
      expect(stubs.debug.calledOnce).to.equal(true)
      expect(stubs.log.calledOnce).to.equal(true)

      transport.log({ [LEVEL]: 'verbose', [MESSAGE]: 'log' }, () => undefined)
      expect(stubs.error.calledOnce).to.equal(true)
      expect(stubs.warn.calledOnce).to.equal(true)
      expect(stubs.info.calledOnce).to.equal(true)
      expect(stubs.debug.calledOnce).to.equal(true)
      expect(stubs.log.calledTwice).to.equal(true)

      transport.log({ [LEVEL]: 'jibberish', [MESSAGE]: 'log' }, () => undefined)
      expect(stubs.error.calledOnce).to.equal(true)
      expect(stubs.warn.calledOnce).to.equal(true)
      expect(stubs.info.calledOnce).to.equal(true)
      expect(stubs.debug.calledOnce).to.equal(true)
      expect(stubs.log.calledThrice).to.equal(true)
    } finally {
      for (const level of levels) {
        stubs[level].restore()
      }
    }
  })

})
