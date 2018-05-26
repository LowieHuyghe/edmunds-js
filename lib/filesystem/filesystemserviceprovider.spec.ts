import Edmunds from '../edmunds'
import FileSystemServiceProvider from './filesystemserviceprovider'
import { expect } from 'chai'
import 'mocha'
import * as importFresh from 'import-fresh'
import * as appRootPath from 'app-root-path'
import FileSystemManager from './filesystemmanager'
import Local from './drivers/local'

describe('filesystemserviceprovider.ts', () => {

  it('should have filesystemmanager', async () => {
    const edmunds = new Edmunds(appRootPath.path)
    expect(edmunds.fileSystemManager).to.be.an('undefined')
    await edmunds.register(FileSystemServiceProvider)
    expect(edmunds.fileSystemManager).to.be.instanceof(FileSystemManager)
  })

  it('should have filesystemmanager with config', async () => {
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
    edmunds.config = importFresh('config')

    expect(edmunds.fileSystemManager).to.be.an('undefined')
    await edmunds.register(FileSystemServiceProvider)
    expect(edmunds.fileSystemManager).to.be.instanceof(FileSystemManager)

    expect(edmunds.fileSystem()).to.be.an.instanceof(Local)
    expect(edmunds.fileSystem('local')).to.be.an.instanceof(Local)
    expect(edmunds.fileSystemManager.get()).to.be.an.instanceof(Local)
    expect(edmunds.fileSystemManager.get('local')).to.be.an.instanceof(Local)
  })

})
