# Seeding

Seeding is not implemented by default in
[typeorm](https://github.com/typeorm/typeorm). So Edmunds has an
alternative using the [kernel](../cli/kernel.md), the
`SeedCommand`, and the `Seeder`.


## Setting it up

### 1. TypeORM-Entity

You will probably have an typeorm-entity. For example:

```typescript
// src/app/database/entity/myentity.ts

import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'

@Entity()
export default class MyEntity {

  @PrimaryGeneratedColumn()
  id: number

  @Column()
  title: string

  @Column()
  text: string

}
```

### 2. Create seeder

Then create your seeder:

```typescript
// src/app/database/seeder/myentityseeder.ts

import { Seeder } from 'edmunds'
import MyEntity from '../entity/myentity'
import * as faker from 'faker'

export default class MyEntitySeeder extends Seeder {
  /**
   * Call the seeder
   * @returns {Promise<void>}
   */
  async call (): Promise<void> {
    const entities: MyEntity[] = []
    for (let i = 0; i < 100; ++i) {
      const entity = new MyEntity()
      entity.title = faker.lorem.sentence()
      entity.text = faker.lorem.sentences(5)

      entities.push(entity)
    }

    const connection = this.edmunds.database()
    await connection.manager.save(entities)
  }
}
```

### 3. Extend SeedCommand

Next extend `SeedCommand` and add your seeder:

```typescript
// src/app/database/seedcommand.ts

import { Edmunds, Seeder, SeedCommand as EdmundsSeedCommand } from 'edmunds'
import MyEntitySeeder from './seeder/myentityseeder'

export default class SeedCommand extends EdmundsSeedCommand {
  /**
   * Get seeders
   */
  protected getSeeders (): (new (app: Edmunds) => Seeder)[] {
    return [
      MyEntitySeeder
    ]
  }
}
```

### 4. Add to kernel

Finally add your `SeedCommand` to the array of `getCommands` in your
kernel (for more info on the kernel, go [here](../cli/kernel.md)).


## Usage

Now you can seed your database using the cli-command:

```bash
ts-node src/cli.ts db:seed
```
