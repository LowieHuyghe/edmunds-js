import * as Joi from 'joi'
import * as Bluebird from 'bluebird'

export class ObjectWrapper {
  /**
   * Data
   */
  public data: object

  /**
   * Constructor
   * @param {object} data
   */
  constructor (data: object) {
    this.data = data
  }

  /**
   * Check if object has key
   * @param {string} key
   * @returns {boolean}
   */
  has (key: string) {
    return key in this.data
  }

  /**
   * Get the value of a key
   * @param {string} key
   * @param defaultt
   * @returns {any}
   */
  get (key: string, defaultt: any = undefined) {
    return this.has(key)
      ? (this.data as any)[key]
      : defaultt
  }

  /**
   * Validate the data
   * @param {Joi.Schema} schema
   * @returns {Joi.ValidationResult<ObjectWrapper>}
   */
  validate (schema: Joi.Schema): Joi.ValidationResult<object> {
    return schema.validate(this.data)
  }

  /**
   * Asynchronously validate the data
   * @param {Joi.Schema} schema
   * @returns {Bluebird<object>}
   */
  asyncValidate (schema: Joi.Schema): Bluebird<object> {
    const promise = Bluebird.promisify<object, object>(schema.validate, { context: schema })
    return promise(this.data)
  }
}
