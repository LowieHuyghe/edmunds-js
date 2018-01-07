import { Edmunds } from './edmunds'
import { expect } from 'chai'
import * as express from 'express'
import 'mocha'

describe('Edmunds', () => {

  it('should have express', () => {
    const edmunds = new Edmunds()
    expect(typeof edmunds.app).to.equal(typeof express())
  })

})
