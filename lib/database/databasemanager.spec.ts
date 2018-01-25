import { Edmunds } from '../edmunds'
import { expect } from 'chai'
import 'mocha'
import { DatabaseManager } from './databasemanager'

describe('databasemanager.ts', () => {

  it('should empty list without config', () => {
    const edmunds = new Edmunds()
    const manager = new DatabaseManager(edmunds, [])

    expect(Object.keys(manager.all()).length).to.equal(0)
  })

  it('should list with options', () => {
    const config = [
      {
        name: 'mysql',
        type: 'mysql',
        host: 'localhost',
        port: 3306,
        database: 'test',
        username: 'root',
        password: 'root'
      },
      {
        name: 'sqlite',
        type: 'sqlite',
        database: './database/sqlite.db'
      }
    ]

    const edmunds = new Edmunds()
    const manager = new DatabaseManager(edmunds, config)

    expect(Object.keys(manager.all()).length).to.equal(2)
    expect(manager.get()).to.include({
      name: 'mysql',
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      database: 'test',
      username: 'root',
      password: 'root'
    })
    expect(manager.get('mysql')).to.include({
      name: 'mysql',
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      database: 'test',
      username: 'root',
      password: 'root'
    })
    expect(manager.get('sqlite')).to.include({
      name: 'sqlite',
      type: 'sqlite',
      database: './database/sqlite.db'
    })
  })

})
