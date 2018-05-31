import Edmunds from '../edmunds/edmunds'
import FileSystemManager from './filesystemmanager'
import * as chai from 'chai'
import * as appRootPath from 'app-root-path'
import 'mocha'
import Local from './drivers/local'
import GoogleCloudStorage from './drivers/googlecloudstorage'

const chaiAsPromised = require('chai-as-promised')
chai.use(chaiAsPromised)
const expect = chai.expect

describe('FileSystemManager', () => {

  it('should throw error when instantiating local without path', async () => {
    const config = [{
      name: 'local',
      driver: 'local'
    }]

    const edmunds = new Edmunds(appRootPath.path)
    const manager = new FileSystemManager(edmunds, config)

    await expect(manager.get()).to.be.rejectedWith("'path'-config is missing for filesystem-instance 'local'")
  })

  it('should have local', async () => {
    const config = [{
      name: 'local',
      driver: 'local',
      path: 'storage'
    }]

    const edmunds = new Edmunds(appRootPath.path)
    const manager = new FileSystemManager(edmunds, config)

    expect(await manager.get()).to.be.an.instanceof(Local)
    expect(await manager.get('local')).to.be.an.instanceof(Local)
  })

  it('should throw error when instantiating Google Cloud Storage without bucket', async () => {
    const config = [{
      name: 'googlecloudstorage',
      driver: 'googlecloudstorage'
    }]

    const edmunds = new Edmunds(appRootPath.path)
    const manager = new FileSystemManager(edmunds, config)

    await expect(manager.get()).to.be.rejectedWith("'bucket'-config is missing for filesystem-instance 'googlecloudstorage'")
  })

  it('should have Google Cloud Storage', async () => {
    const config = [{
      name: 'googlecloudstorage',
      driver: 'googlecloudstorage',
      path: 'storage',
      bucket: 'non-existing-bucket'
    }]
    const edmunds = new Edmunds(appRootPath.path)
    const manager = new FileSystemManager(edmunds, config)

    expect(await manager.get()).to.be.an.instanceof(GoogleCloudStorage)
    expect(await manager.get('googlecloudstorage')).to.be.an.instanceof(GoogleCloudStorage)
  })

})
