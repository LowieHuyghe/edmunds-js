import { Application } from './application'
import { expect } from 'chai'
import * as express from 'express'
import 'mocha'

describe('Application', () => {

  it('should have express', () => {
    const app = new Application()
    expect(typeof app.express).to.equal(typeof express())
  })

})
