import {
  Edmunds,
  ErrorMiddleware,
  Controller,
  Middleware,
  ObjectWrapper,
  ServiceProvider,
  Manager,
  LoggingServiceProvider,
  Kernel,
  Command,
  DatabaseServiceProvider,
  SeedCommand,
  Seeder
} from './index'
import { expect } from 'chai'
import 'mocha'

describe('index.js', () => {

  it('check export', () => {
    expect(Edmunds).to.not.be.a('undefined')
    expect(ErrorMiddleware).to.not.be.a('undefined')
    expect(Controller).to.not.be.a('undefined')
    expect(Middleware).to.not.be.a('undefined')
    expect(ObjectWrapper).to.not.be.a('undefined')
    expect(ServiceProvider).to.not.be.a('undefined')
    expect(Manager).to.not.be.a('undefined')
    expect(LoggingServiceProvider).to.not.be.a('undefined')
    expect(Kernel).to.not.be.a('undefined')
    expect(Command).to.not.be.a('undefined')
    expect(DatabaseServiceProvider).to.not.be.a('undefined')
    expect(SeedCommand).to.not.be.a('undefined')
    expect(Seeder).to.not.be.a('undefined')
  })

})
