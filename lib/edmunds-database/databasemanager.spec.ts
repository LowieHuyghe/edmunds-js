import Edmunds from '../edmunds/edmunds'
import DatabaseManager from './databasemanager'
import * as chai from 'chai'
import * as appRootPath from 'app-root-path'
import 'mocha'
import { Connection, ConnectionOptions } from 'typeorm'

const chaiAsPromised = require('chai-as-promised')
chai.use(chaiAsPromised)
const expect = chai.expect

describe('DatabaseManager', () => {

  it('should have Connection', async () => {
    const connection1: ConnectionOptions = {
      name: 'database1',
      type: 'sqljs'
    }
    const connection2: ConnectionOptions = {
      name: 'default',
      type: 'sqljs'
    }
    const config = [connection1, connection2]

    const edmunds = new Edmunds(appRootPath.path)
    const manager = new DatabaseManager(edmunds, config)

    try {
      expect(await manager.get()).to.be.instanceof(Connection)
      expect((await manager.get()).isConnected).to.equal(true)
      expect((await manager.get()).options).to.include({
        name: 'database1',
        type: 'sqljs'
      })

      expect(await manager.get('database1')).to.be.instanceof(Connection)
      expect((await manager.get('database1')).isConnected).to.equal(true)
      expect((await manager.get('database1')).options).to.include({
        name: 'database1',
        type: 'sqljs'
      })

      expect(await manager.get('default')).to.be.instanceof(Connection)
      expect((await manager.get('default')).isConnected).to.equal(true)
      expect((await manager.get('default')).options).to.include({
        name: 'default',
        type: 'sqljs'
      })
    } finally {
      await (await manager.get('database1')).close()
      await (await manager.get('default')).close()
    }
  }).timeout(10000)

})
