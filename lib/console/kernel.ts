import * as commander from 'commander'
import { Edmunds } from '../edmunds'
import { Command } from './command'

export abstract class Kernel {
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
   * Run the program
   */
  run () {
    const program = this.createProgram()
    let programExecuted = false

    for (let commandClass of this.getCommands()) {
      const command = new commandClass(program, this.edmunds)
      command.register(program)
        .action(async (...args: any[]) => {
          programExecuted = true
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

    program.parse(process.argv)

    if (!programExecuted) {
      program.help()
    }
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
