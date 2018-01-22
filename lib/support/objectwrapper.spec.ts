import { ObjectWrapper } from './objectwrapper'
import { expect } from 'chai'
import * as Joi from 'joi'
import 'mocha'

describe('objectwrapper.ts', () => {
  const input: object = {
    name: 'John',
    surname: 'Snow',
    gender: 'male',
    age: null,
    country: undefined
  }
  const schema = Joi.object().keys({
    name: Joi.string().required(),
    surname: Joi.string().required(),
    gender: Joi.string().required(),
    age: Joi.number().min(18).max(130),
    country: Joi.string()
  })

  it('should have a functioning has-function', () => {
    const inputWrapper = new ObjectWrapper(input)

    expect(inputWrapper.has('name')).to.equal(true)
    expect(inputWrapper.has('surname')).to.equal(true)
    expect(inputWrapper.has('gender')).to.equal(true)
    expect(inputWrapper.has('age')).to.equal(true)
    expect(inputWrapper.has('country')).to.equal(true)
    expect(inputWrapper.has('state')).to.equal(false)
    expect(inputWrapper.has('continent')).to.equal(false)
  })

  it('should have a functioning get-function', () => {
    const inputWrapper = new ObjectWrapper(input)

    expect(inputWrapper.get('name')).to.equal('John')
    expect(inputWrapper.get('surname')).to.equal('Snow')
    expect(inputWrapper.get('gender')).to.equal('male')
    expect(inputWrapper.get('age')).to.equal(null)
    expect(inputWrapper.get('country')).to.equal(undefined)

    expect(inputWrapper.get('state')).to.equal(undefined)
    expect(inputWrapper.get('continent')).to.equal(undefined)
    expect(inputWrapper.get('state', 'Florida')).to.equal('Florida')
    expect(inputWrapper.get('continent', 'Europe')).to.equal('Europe')
  })

  it('should have a functioning validate-function', () => {
    const inputWrapper = new ObjectWrapper(input)

    let validateResult = inputWrapper.validate(schema)
    expect(validateResult.error).to.not.be.a('null')
    expect(validateResult.error.details.length).to.equal(1)
    expect(validateResult.error.details[0].context.key).to.equal('age')
    expect(validateResult.error.details[0].context.label).to.equal('age')
    expect(validateResult.error.details[0].type).to.equal('number.base')
    expect(validateResult.error.details[0].message).to.equal('"age" must be a number')
  })

  it('should have a functioning asyncValidate-function', (done) => {
    const inputWrapper = new ObjectWrapper(input)

    inputWrapper.asyncValidate(schema)
      .then(() => {
        throw new Error('Should not validate!')
      })
      .catch((err: Joi.ValidationError) => {
        expect(err).to.not.be.a('null')
        expect(err.details.length).to.equal(1)
        expect(err.details[0].context.key).to.equal('age')
        expect(err.details[0].context.label).to.equal('age')
        expect(err.details[0].type).to.equal('number.base')
        expect(err.details[0].message).to.equal('"age" must be a number')
        done()
      })
  })
})
