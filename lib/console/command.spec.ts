import { Edmunds } from '../edmunds'
import { Command } from './command'
import { expect } from 'chai'
import 'mocha'
import * as appRootPath from 'app-root-path'
import * as commander from 'commander'

describe('Command', () => {

  it('should pass basics', async () => {
    class MyCommand extends Command {
      register (program: commander.Command): commander.Command {
        return program.command('mycommand')
      }

      async run (...args: any[]): Promise<void> {
        expect(this.program).to.equal(commander)
        expect(this.edmunds).to.equal(edmunds)
        return
      }
    }

    const edmunds = new Edmunds(appRootPath.path)
    const command = new MyCommand(commander, edmunds)

    expect(command).to.be.instanceof(Command)
    await command.run()
  })

})
