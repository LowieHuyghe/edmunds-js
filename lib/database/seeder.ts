import { Edmunds } from '../edmunds'

/**
 * Seeder
 */
export abstract class Seeder {
  /**
   * Edmunds instance
   */
  protected edmunds: Edmunds

  /**
   * Constructor
   * @param {Edmunds} edmunds
   */
  constructor (edmunds: Edmunds) {
    this.edmunds = edmunds
  }

  /**
   * Call the seeder
   * @returns {Promise<void>}
   */
  abstract async call (): Promise<void>
}
