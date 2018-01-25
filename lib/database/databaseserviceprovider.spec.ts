import { Edmunds } from '../edmunds'
import { DatabaseServiceProvider } from './databaseserviceprovider'
import { expect } from 'chai'
import 'mocha'
import * as importFresh from 'import-fresh'
import {
  Connection
} from 'typeorm'
import * as fs from 'fs'

describe('databaseserviceprovider.ts', () => {
  const sqlDb1 = './resources/database/sqlite.db'
  const sqlDb2 = './resources/database/sqlite2.db'

  beforeEach(() => {
    if (fs.existsSync(sqlDb1)) {
      fs.unlinkSync(sqlDb1)
    }
    if (fs.existsSync(sqlDb2)) {
      fs.unlinkSync(sqlDb2)
    }
  })

  afterEach(() => {
    if (fs.existsSync(sqlDb1)) {
      fs.unlinkSync(sqlDb1)
    }
    if (fs.existsSync(sqlDb2)) {
      fs.unlinkSync(sqlDb2)
    }
  })

  it('should have no database without config', async () => {
    const edmunds = new Edmunds()
    expect(() => edmunds.database()).to.throw('Connection "default" was not found')
    await edmunds.register(DatabaseServiceProvider)
    expect(() => edmunds.database()).to.throw('Connection "default" was not found')
  })

  it('should have database', async () => {
    // Override config
    process.env.NODE_CONFIG = JSON.stringify({
      database: {
        instances: [
          {
            name: 'default',
            type: 'sqlite',
            database: sqlDb1
          },
          {
            name: 'sqlite2',
            type: 'sqlite',
            database: sqlDb2
          }
        ]
      }
    })
    const edmunds = new Edmunds()
    edmunds.config = importFresh('config')

    expect(() => edmunds.database()).to.throw('Connection "default" was not found')
    await edmunds.register(DatabaseServiceProvider)
    expect(edmunds.database()).to.be.instanceof(Connection)
    expect(edmunds.database().options).to.include({
      name: 'default',
      type: 'sqlite',
      database: sqlDb1
    })
    expect(edmunds.database('default')).to.be.instanceof(Connection)
    expect(edmunds.database('default').options).to.include({
      name: 'default',
      type: 'sqlite',
      database: sqlDb1
    })
    expect(edmunds.database('sqlite2')).to.be.instanceof(Connection)
    expect(edmunds.database('sqlite2').options).to.include({
      name: 'sqlite2',
      type: 'sqlite',
      database: sqlDb2
    })

    expect(fs.existsSync(sqlDb1)).to.equal(true)
    expect(fs.existsSync(sqlDb2)).to.equal(true)
  })

})
