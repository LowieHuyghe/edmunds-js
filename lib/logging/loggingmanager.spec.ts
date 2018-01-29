import { Edmunds } from '../edmunds'
import { LoggingManager } from './loggingmanager'
import { expect } from 'chai'
import * as appRootPath from 'app-root-path'
import 'mocha'
import {
  transports,
  ConsoleTransportInstance,
  ConsoleTransportOptions,
  FileTransportInstance,
  FileTransportOptions,
  HttpTransportInstance,
  HttpTransportOptions
} from 'winston'

describe('loggingmanager.ts', () => {

  it('should have Console by default', () => {
    const options: ConsoleTransportOptions = {
      logstash: true,
      debugStdout: false
    }
    const config = [{
      name: 'console',
      driver: 'Console',
      ...options
    }]

    const edmunds = new Edmunds(appRootPath.path)
    const manager = new LoggingManager(edmunds, config)

    expect(manager.get()).to.be.an.instanceof(transports.Console)
    expect(manager.get('console')).to.be.an.instanceof(transports.Console)

    const instance: ConsoleTransportInstance = manager.get()
    expect(instance.name).to.equal(config[0].name)
    expect(instance.logstash).to.equal(config[0].logstash)
  })

  it('should have File by default', () => {
    const options: FileTransportOptions = {
      logstash: true,
      maxsize: 10,
      rotationFormat: true,
      zippedArchive: false,
      maxFiles: 11,
      eol: 'EOL',
      tailable: true,
      maxRetries: 12,
      filename: 'loggylog.txt',
      dirname: 'app://'
    }
    const config = [{
      name: 'file',
      driver: 'File',
      ...options
    }]

    const edmunds = new Edmunds(appRootPath.path)
    const manager = new LoggingManager(edmunds, config)

    expect(manager.get()).to.be.an.instanceof(transports.File)
    expect(manager.get('file')).to.be.an.instanceof(transports.File)

    const instance: FileTransportInstance = manager.get()
    expect(instance.name).to.equal(config[0].name)
    expect(instance.logstash).to.equal(config[0].logstash)
    expect(instance.maxsize).to.equal(config[0].maxsize)
    expect(instance.rotationFormat).to.equal(config[0].rotationFormat)
    expect(instance.zippedArchive).to.equal(config[0].zippedArchive)
    expect(instance.maxFiles).to.equal(config[0].maxFiles)
    expect(instance.eol).to.equal(config[0].eol)
    expect(instance.tailable).to.equal(config[0].tailable)
    expect(instance.maxRetries).to.equal(config[0].maxRetries)
  })

  it('should have Http by default', () => {
    const options: HttpTransportOptions = {
      ssl: true
    }
    const config = [{
      name: 'http',
      driver: 'Http',
      ...options
    }]

    const edmunds = new Edmunds(appRootPath.path)
    const manager = new LoggingManager(edmunds, config)

    expect(manager.get()).to.be.an.instanceof(transports.Http)
    expect(manager.get('http')).to.be.an.instanceof(transports.Http)

    const instance: HttpTransportInstance = manager.get()
    expect(instance.name).to.equal(config[0].name)
    expect(instance.ssl).to.equal(config[0].ssl)
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
