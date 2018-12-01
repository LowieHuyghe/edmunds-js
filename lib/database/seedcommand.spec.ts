import Edmunds from '../edmunds'
import SeedCommand from './seedcommand'
import { expect } from 'chai'
import 'mocha'
import * as appRootPath from 'app-root-path'
import * as commander from 'commander'
import Seeder from './seeder'
import Command from '../console/command'
import Kernel from '../console/kernel'

describe('SeedCommand', () => {
  beforeEach(() => {
    MyKernel.iRan = false
    MySeedCommand.iRan = false
    MySeeder.iRan = false
  })

  it('should pass basics', async () => {
    class ThisSeedCommand extends MySeedCommand {
      async run (options: any): Promise<void> {
        expect(this.program).to.equal(commander)
        expect(this.edmunds).to.equal(edmunds)
        await super.run(options)
      }
    }

    const edmunds = new Edmunds(appRootPath.path)
    const seedCommand = new ThisSeedCommand(commander, edmunds)

    expect(seedCommand).to.be.instanceof(SeedCommand)
    await seedCommand.run({ quiet: true })
    expect(MySeedCommand.iRan).to.equal(true)
  })

  it('should load seedcommand', async () => {
    const edmunds = new Edmunds(appRootPath.path)
    const kernel = new MyKernel(edmunds, ['npm', 'run'])

    await kernel.run()

    expect(MyKernel.iRan).to.equal(true)
    expect(MySeedCommand.iRan).to.equal(false)
    expect(MySeeder.iRan).to.equal(false)
  })

  it('should run seeders', async () => {
    const edmunds = new Edmunds(appRootPath.path)
    const kernel = new MyKernel(edmunds, ['node', 'cli.js', 'db:seed', '--quiet'])

    await kernel.run()

    expect(MyKernel.iRan).to.equal(true)
    expect(MySeedCommand.iRan).to.equal(true)
    expect(MySeeder.iRan).to.equal(true)
  })

})

class MySeeder extends Seeder {
  static iRan = false

  async call (): Promise<void> {
    MySeeder.iRan = true
  }
}

class MySeedCommand extends SeedCommand {
  static iRan = false

  async run (options: any): Promise<void> {
    MySeedCommand.iRan = true
    await super.run(options)
  }

  protected getSeeders (): { new(app: Edmunds): Seeder }[] {
    return [MySeeder]
  }
}

class MyKernel extends Kernel {
  static iRan = false

  async run () {
    MyKernel.iRan = true
    await super.run()
  }

  protected help (program: commander.Command): void {
    // Don't print help as it closes the current process
  }

  protected getCommands (): { new(program: commander.Command, app: Edmunds): Command }[] {
    return [MySeedCommand]
  }
}
