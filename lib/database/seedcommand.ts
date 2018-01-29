import * as commander from 'commander'
import { Command } from '../console/command'
import { Seeder } from './seeder'
import { Edmunds } from '../edmunds'

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
  }

  /**
   * Run the command
   * @returns {Promise<void>}
   */
  async run (): Promise<void> {
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
