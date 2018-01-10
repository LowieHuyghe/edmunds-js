import {
  Edmunds,
  ErrorMiddleware,
  Controller,
  Middleware,
  ServiceProvider,
  Manager
} from './index'
import { expect } from 'chai'
import 'mocha'

describe('index.js', () => {

  it('check export', () => {
    expect(Edmunds).to.not.be.a('undefined')
    expect(ErrorMiddleware).to.not.be.a('undefined')
    expect(Controller).to.not.be.a('undefined')
    expect(Middleware).to.not.be.a('undefined')
    expect(ServiceProvider).to.not.be.a('undefined')
    expect(Manager).to.not.be.a('undefined')
  })

})
