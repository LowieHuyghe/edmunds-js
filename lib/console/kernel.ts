import * as commander from 'commander'
import { Edmunds } from '../edmunds'
import { Command } from './command'

export abstract class Kernel {
  /**
   * Edmunds instance
   */
  protected edmunds: Edmunds

  /**
   * Arguments
   */
  protected argv: string[]

  /**
   * Check if ran command
   */
  protected executed: boolean = false

  /**
   * Constructor
   * @param {Edmunds} edmunds
   * @param {string[]} argv
   */
  constructor (edmunds: Edmunds, argv?: string[]) {
    this.edmunds = edmunds
    this.argv = argv || process.argv
  }

  /**
   * Run the program
   */
  run () {
    const program = this.createProgram()
    this.registerCommands(program)

    program.parse(this.argv)

    if (!this.executed) {
      this.help(program)
    }
  }

  /**
   * Register the commands
   * @param {commander.Command} program
   */
  protected registerCommands (program: commander.Command) {
    for (let commandClass of this.getCommands()) {
      const command = new commandClass(program, this.edmunds)
      command.register(program)
        .action(async (...args: any[]) => {
          this.executed = true
          try {
            await command.run(...args)
          } catch (e) {
            if (e.message && e.stack) {
              console.error(e.message, e.stack)
            } else {
              console.error(e)
            }
            process.exitCode = 1
          }
        })
    }
  }

  /**
   * Print the help
   * @param {commander.Command} program
   */
  protected help (program: commander.Command) {
    program.help()
  }

  /**
   * Get program
   * @returns {commander.Command}
   */
  protected createProgram (): commander.Command {
    commander.version('0.1.0')
    return commander
  }

  /**
   * Get commands
   */
  protected abstract getCommands (): (new (program: commander.Command, app: Edmunds) => Command)[]
}
