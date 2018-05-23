import { Edmunds } from '../edmunds'
import FileSystemManager from './filesystemmanager'
import { expect } from 'chai'
import * as appRootPath from 'app-root-path'
import 'mocha'
import Local from './drivers/local'
import GoogleCloudStorage from './drivers/googlecloudstorage'

describe('FileSystemManager', () => {

  it('should throw error when instantiating local without path', () => {
    const config = [{
      name: 'local',
      driver: 'local'
    }]

    const edmunds = new Edmunds(appRootPath.path)
    const manager = new FileSystemManager(edmunds, config)

    expect(() => manager.get()).to.throw("'path'-config is missing for filesystem-instance 'local'")
  })

  it('should have local', () => {
    const config = [{
      name: 'local',
      driver: 'local',
      path: 'storage'
    }]

    const edmunds = new Edmunds(appRootPath.path)
    const manager = new FileSystemManager(edmunds, config)

    expect(manager.get()).to.be.an.instanceof(Local)
    expect(manager.get('local')).to.be.an.instanceof(Local)
  })

  it('should throw error when instantiating Google Cloud Storage with missing config', () => {
    const config = [{
      name: 'googlecloudstorage',
      driver: 'googlecloudstorage'
    }]
    const edmunds = new Edmunds(appRootPath.path)
    const manager = new FileSystemManager(edmunds, config)
    expect(() => manager.get()).to.throw("'bucket'- or 'path'-config is missing for filesystem-instance 'googlecloudstorage'")

    const config2 = [{
      name: 'googlecloudstorage',
      driver: 'googlecloudstorage',
      path: 'storage'
    }]
    const edmunds2 = new Edmunds(appRootPath.path)
    const manager2 = new FileSystemManager(edmunds2, config2)
    expect(() => manager2.get()).to.throw("'bucket'- or 'path'-config is missing for filesystem-instance 'googlecloudstorage'")

    const config3 = [{
      name: 'googlecloudstorage',
      driver: 'googlecloudstorage',
      bucket: 'non-existing-bucket'
    }]
    const edmunds3 = new Edmunds(appRootPath.path)
    const manager3 = new FileSystemManager(edmunds3, config3)
    expect(() => manager3.get()).to.throw("'bucket'- or 'path'-config is missing for filesystem-instance 'googlecloudstorage'")
  })

  it('should have Google Cloud Storage', () => {
    const config = [{
      name: 'googlecloudstorage',
      driver: 'googlecloudstorage',
      path: 'storage',
      bucket: 'non-existing-bucket'
    }]
    const edmunds = new Edmunds(appRootPath.path)
    const manager = new FileSystemManager(edmunds, config)

    expect(manager.get()).to.be.an.instanceof(GoogleCloudStorage)
    expect(manager.get('googlecloudstorage')).to.be.an.instanceof(GoogleCloudStorage)
  })

})
