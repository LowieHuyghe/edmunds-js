# Kernel

The kernel is an entry point for commands and cli-usage. It is a
wrapper built on [commander.js](https://github.com/tj/commander.js/).


## Setting up

### 1. Create command

First let's create a command:

```typescript
// src/app/console/command/helloworldcommand.ts

import * as commander from 'commander'
import { Command, Edmunds, Seeder } from 'edmunds'

export class HelloWorldCommand extends Command {
  /**
   * Register the command
   * @param {commander.Command} program
   * @return {commander.Command}
   */
  register (program: commander.Command): commander.Command {
    return program
      .command('helloworld')
      .description('Run Hello World!')
      .option('-w, --what <what>', 'Hello what?', 'World')
  }

  /**
   * Run the command
   * @param {any} options
   * @returns {Promise<void>}
   */
  async run (options: any): Promise<void> {
    console.log(`Hello ${options.what}!`)

    // this.program: commander.Command
    // this.edmunds: Edmunds
  }
}
```

### 2. Create kernel

Next create your kernel and define your newly created command:

```typescript
// src/app/console/kernel.ts

import { Edmunds, Kernel as EdmundsKernel, Command } from 'edmunds'
import * as commander from 'commander'
import { HelloWorldCommand } from './command/helloworldcommand'

export class Kernel extends EdmundsKernel {
  /**
   * Get commands
   */
  protected getCommands (): (new (program: commander.Command, app: Edmunds) => Command)[] {
    return [
      HelloWorldCommand
    ]
  }
}
``` 

### 3. Create entry point

Finally create the entry point for cli-usage:

```typescript
// src/cli.ts

import { bootstrap } from './bootstrap/app'
import { Kernel } from './app/console/kernel'

(async (): Promise<void> => {

  const edmunds = await bootstrap()
  const kernel = new Kernel(edmunds)

  try {
    await kernel.run()
  } catch (e) {
    console.error(e)
  }

})()
  .then(() => {
    //
  })
  .catch((reason: any) => {
    console.error(reason)
  })

```

### All together

The kernel will use `commander` to register all the commands as
sub-commands. When you call the `run`-function of the kernel, it will
call `commander.parse` with `process.argv` which calls the correct
command.

Explained simple in psuedocode:

```
> Kernel.run()
  > program = commander
  > loop over all commandClasses in getCommands()
    > command = new CommandClass(...)
    > command.register(program)
  > program.parse(process.argv)
```


## Usage

```bash
ts-node src/cli.ts
```

Further documentation regarding commands, options, arguments,...
can be found on the
[commander.js-repo](https://github.com/tj/commander.js/).
