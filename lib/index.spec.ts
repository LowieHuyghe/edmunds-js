import {
  Edmunds,
  ErrorMiddleware,
  Controller,
  Middleware
} from './index'
import { expect } from 'chai'
import 'mocha'

describe('index.js', () => {

  it('check export', () => {
    expect(Edmunds).to.not.be.a('undefined')
    expect(ErrorMiddleware).to.not.be.a('undefined')
    expect(Controller).to.not.be.a('undefined')
    expect(Middleware).to.not.be.a('undefined')
  })

})
