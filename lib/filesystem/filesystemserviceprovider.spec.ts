import Edmunds from '../edmunds'
import FileSystemServiceProvider from './filesystemserviceprovider'
import 'mocha'
import * as appRootPath from 'app-root-path'
import FileSystemManager from './filesystemmanager'
import Local from './drivers/local'
import * as chai from 'chai'
import * as chaiAsPromised from 'chai-as-promised'

chai.use(chaiAsPromised)
const expect = chai.expect

describe('filesystemserviceprovider.ts', () => {

  it('should have filesystemmanager multiple', async () => {
    // Override config
    process.env.NODE_CONFIG = JSON.stringify({
      filesystem: {
        instances: [{
          name: 'local',
          driver: 'local',
          path: 'storage'
        }]
      }
    })
    const edmunds = new Edmunds(appRootPath.path)
    delete require.cache[require.resolve('config')]
    edmunds.config = require('config')

    expect(edmunds.app.get('edmunds-filesystem-manager')).to.be.an('undefined')
    edmunds.register(FileSystemServiceProvider)
    expect(edmunds.app.get('edmunds-filesystem-manager')).to.be.instanceof(FileSystemManager)

    expect(await edmunds.fileSystem()).to.be.an.instanceof(Local)
    expect(await edmunds.fileSystem('local')).to.be.an.instanceof(Local)
    expect(await edmunds.app.get('edmunds-filesystem-manager').get()).to.be.an.instanceof(Local)
    expect(await edmunds.app.get('edmunds-filesystem-manager').get('local')).to.be.an.instanceof(Local)
  })

  it('should have filesystemmanager single', async () => {
    // Override config
    process.env.NODE_CONFIG = JSON.stringify({
      filesystem: {
        instance: {
          name: 'local1',
          driver: 'local',
          path: 'storage'
        },
        instances: [{
          name: 'local2',
          driver: 'local',
          path: 'storage'
        }]
      }
    })
    const edmunds = new Edmunds(appRootPath.path)
    delete require.cache[require.resolve('config')]
    edmunds.config = require('config')

    expect(edmunds.app.get('edmunds-filesystem-manager')).to.be.an('undefined')
    edmunds.register(FileSystemServiceProvider)
    expect(edmunds.app.get('edmunds-filesystem-manager')).to.be.instanceof(FileSystemManager)

    expect(await edmunds.fileSystem()).to.be.an.instanceof(Local)
    expect(await edmunds.fileSystem('local1')).to.be.an.instanceof(Local)
    await expect(edmunds.fileSystem('local2')).to.be.rejectedWith('No instance declared with name "local2"')
    expect(await edmunds.app.get('edmunds-filesystem-manager').get()).to.be.an.instanceof(Local)
    expect(await edmunds.app.get('edmunds-filesystem-manager').get('local1')).to.be.an.instanceof(Local)
    await expect(edmunds.app.get('edmunds-filesystem-manager').get('local2')).to.be.rejectedWith('No instance declared with name "local2"')
  })

})
