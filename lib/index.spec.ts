import {
  Edmunds,
  ErrorMiddleware,
  Controller,
  Middleware,
  ObjectWrapper,
  ServiceProvider,
  Manager,
  LoggingServiceProvider,
  ErrorHandlerServiceProvider,
  BodyParserServiceProvider,
  MethodOverrideServiceProvider
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
    expect(ErrorHandlerServiceProvider).to.not.be.a('undefined')
    expect(BodyParserServiceProvider).to.not.be.a('undefined')
    expect(MethodOverrideServiceProvider).to.not.be.a('undefined')
  })

})
