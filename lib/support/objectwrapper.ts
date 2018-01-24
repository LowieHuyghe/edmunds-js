import * as Joi from 'joi'

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
  get (key: string, defaultt?: any) {
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
   * @returns {Promise<object>}
   */
  asyncValidate (schema: Joi.Schema): Promise<object> {
    return new Promise<object>((resolve, reject) => {
      return schema.validate(this.data, (err: Joi.ValidationError, value: object) => {
        if (err) {
          reject(err)
        } else {
          resolve(value)
        }
      })
    })
  }
}
