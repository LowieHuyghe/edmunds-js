import * as commander from 'commander'
import Edmunds from '../edmunds'
import Command from './command'

export default abstract class Kernel {
  /**
   * Edmunds instance
   */
  protected edmunds: Edmunds

  /**
   * Arguments
   */
  protected argv: string[]

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
  async run () {
    try {
      await new Promise((resolve, reject) => {
        const program = this.createProgram()

        this.registerCommands(program, resolve, reject)
        program.on('command:*', () => {
          reject(new Error('Invalid command given'))
        })

        program.parse(this.argv)
        if (!program.args.length) {
          this.help(program)
          process.exitCode = 1
          resolve()
        }
      })
    } catch (e) {
      console.error(e)
      process.exitCode = 1
    }
  }

  /**
   * Register the commands
   * @param {commander.Command} program
   * @param resolve
   * @param reject
   */
  protected registerCommands (program: commander.Command, resolve: () => void, reject: (err: Error) => void) {
    for (let commandClass of this.getCommands()) {
      const command = new commandClass(program, this.edmunds)
      command.register(program)
        .action(async (...args: any[]) => {
          try {
            await command.run(...args)
            resolve()
          } catch (e) {
            reject(e)
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
