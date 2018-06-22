import Edmunds from '../edmunds'
import LoggingManager from './loggingmanager'
import { expect } from 'chai'
import * as appRootPath from 'app-root-path'
import 'mocha'
import { transports } from 'winston'
import { RawConsole } from './drivers/rawconsole'

describe('loggingmanager.ts', () => {

  it('should have Console by default', async () => {
    const config = [{
      name: 'console',
      driver: 'Console',
      level: 'warn'
    }]

    const edmunds = new Edmunds(appRootPath.path)
    const manager = new LoggingManager(edmunds, config)

    expect(await manager.get()).to.be.an.instanceof(transports.Console)
    expect(await manager.get('console')).to.be.an.instanceof(transports.Console)

    const instance = await manager.get() as any
    expect(instance.level).to.equal(config[0].level)
  })

  it('should have RawConsole by default', async () => {
    const config = [{
      name: 'rawconsole',
      driver: 'RawConsole',
      level: 'info'
    }]

    const edmunds = new Edmunds(appRootPath.path)
    const manager = new LoggingManager(edmunds, config)

    expect(await manager.get()).to.be.an.instanceof(RawConsole)
    expect(await manager.get('rawconsole')).to.be.an.instanceof(RawConsole)

    const instance = await manager.get() as RawConsole
    expect(instance.level).to.equal(config[0].level)
  })

  it('should have File by default', async () => {
    const config = [{
      name: 'file',
      driver: 'File',
      level: 'error',
      filename: 'loggylog.txt',
      dirname: 'app://'
    }]

    const edmunds = new Edmunds(appRootPath.path)
    const manager = new LoggingManager(edmunds, config)

    expect(await manager.get()).to.be.an.instanceof(transports.File)
    expect(await manager.get('file')).to.be.an.instanceof(transports.File)

    const instance = await manager.get() as any
    expect(instance.name).to.equal(config[0].name)
    expect(instance.level).to.equal(config[0].level)
    expect(instance.filename).to.equal(config[0].filename)
    expect(instance.dirname).to.equal(config[0].dirname)
  })

  it('should have Http by default', async () => {
    const config = [{
      name: 'http',
      driver: 'Http',
      level: 'info'
    }]

    const edmunds = new Edmunds(appRootPath.path)
    const manager = new LoggingManager(edmunds, config)

    expect(await manager.get()).to.be.an.instanceof(transports.Http)
    expect(await manager.get('http')).to.be.an.instanceof(transports.Http)

    const instance = await manager.get() as any
    expect(instance.name).to.equal(config[0].name)
    expect(instance.level).to.equal(config[0].level)
  })

  it('should not have', () => {
    const edmunds = new Edmunds(appRootPath.path)

    let config = [{ name: 'http', driver: 'http' }]
    let manager = new LoggingManager(edmunds, config)
    expect(() => manager.get()).to.throw('Driver "http" could not be found for winston. Is the transporter installed?')

    config = [{ name: 'file', driver: 'file' }]
    manager = new LoggingManager(edmunds, config)
    expect(() => manager.get()).to.throw('Driver "file" could not be found for winston. Is the transporter installed?')

    config = [{ name: 'console', driver: 'console' }]
    manager = new LoggingManager(edmunds, config)
    expect(() => manager.get()).to.throw('Driver "console" could not be found for winston. Is the transporter installed?')

    config = [{ name: 'mongodb', driver: 'MongoDB' }]
    manager = new LoggingManager(edmunds, config)
    expect(() => manager.get()).to.throw('Driver "MongoDB" could not be found for winston. Is the transporter installed?')
  })

})
