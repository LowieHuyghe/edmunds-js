import Edmunds from '../edmunds'
import FileSystemServiceProvider from './filesystemserviceprovider'
import { expect } from 'chai'
import 'mocha'
import * as appRootPath from 'app-root-path'
import FileSystemManager from './filesystemmanager'
import Local from './drivers/local'

describe('filesystemserviceprovider.ts', () => {

  it('should have filesystemmanager', async () => {
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

})
