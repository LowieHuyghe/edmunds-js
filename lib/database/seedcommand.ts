import * as commander from 'commander'
import { Command } from '../console/command'
import { Seeder } from './seeder'
import { Edmunds } from '../edmunds'
import * as inquirer from 'inquirer'

export abstract class SeedCommand extends Command {
  /**
   * Register the command
   * @param {commander.Command} program
   * @return {commander.Command}
   */
  register (program: commander.Command): commander.Command {
    return program
      .command('db:seed')
      .description('Seed the database')
      .option('-q, --quiet', 'Run without input')
  }

  /**
   * Run the command
   * @param {any} options
   * @returns {Promise<void>}
   */
  async run (options: any): Promise<void> {
    if (!options.quiet) {
      const answers: inquirer.Answers = await inquirer.prompt({
        name: 'yousure',
        type: 'confirm',
        message: `Are you sure you want to seed the database? (env: ${this.edmunds.getEnvironment()})`
      })
      if (!answers.yousure) {
        return
      }
    }

    for (let seederClass of this.getSeeders()) {
      const seeder = new seederClass(this.edmunds)
      console.log(`Started seeding using ${seederClass.name}`)
      await seeder.call()
      console.log(`Finished seeding using ${seederClass.name}`)
    }
  }

  /**
   * Get seeders
   */
  protected abstract getSeeders (): (new (app: Edmunds) => Seeder)[]
}
