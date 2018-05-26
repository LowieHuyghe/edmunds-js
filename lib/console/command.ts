import * as commander from 'commander'
import Edmunds from '../edmunds'

/**
 * Base Command
 */
export default abstract class Command {
  /**
   * Current Program
   */
  protected program: commander.Command

  /**
   * Edmunds instance
   */
  protected edmunds: Edmunds

  /**
   * Constructor
   * @param {commander.Command} program
   * @param {Edmunds} edmunds
   */
  constructor (program: commander.Command, edmunds: Edmunds) {
    this.program = program
    this.edmunds = edmunds
  }

  /**
   * Register the command
   * @returns {commander.Command}
   */
  abstract register (program: commander.Command): commander.Command

  /**
   * Run the command
   * @returns {Promise<void>}
   */
  abstract async run (...args: any[]): Promise<void>
}
