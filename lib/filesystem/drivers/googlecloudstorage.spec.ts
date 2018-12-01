import Edmunds from '../../edmunds'
import FileSystemManager from '../filesystemmanager'
import { expect } from 'chai'
import * as appRootPath from 'app-root-path'
import 'mocha'
import GoogleCloudStorage from './googlecloudstorage'
import * as path from 'path'
import * as fs from 'fs'
import * as util from 'util'
import * as mkdirp from 'mkdirp'
import * as os from 'os'
import * as sinon from 'sinon'
import * as rimraf from 'rimraf'

describe('GoogleCloudStorage', () => {
  afterEach(async () => {
    const root = path.join(os.tmpdir(), 'testing-edmunds')
    if (fs.existsSync(root)) {
      rimraf.sync(root)
    }
  })

  async function getDriver (storagePath: string, prefix?: string): Promise<GoogleCloudStorage> {
    const config = [{
      name: 'googlecloudstorage',
      driver: 'googlecloudstorage',
      bucket: 'non-existing-bucket',
      prefix: prefix,
      path: storagePath
    }]

    const edmunds = new Edmunds(appRootPath.path)
    const manager = new FileSystemManager(edmunds, config)

    const instance = await manager.get()
    expect(instance).to.be.an.instanceof(GoogleCloudStorage)
    return instance as GoogleCloudStorage
  }

  const tempDir = path.join(os.tmpdir(), 'testing-edmunds')

  it('should have working path function', async () => {
    const storagePath = path.join('storage', 'files')
    const instance = await getDriver(storagePath)

    expect(instance.path()).to.equal(storagePath)
    expect(instance.path('justafile.txt')).to.equal(path.join(storagePath, 'justafile.txt'))
    expect(instance.path(path.join('subdirectory', 'anotherpath.txt'))).to.equal(path.join(storagePath, 'subdirectory', 'anotherpath.txt'))

    const prefix = 'prefix.is.nice.'
    const instanceWithPrefix = await getDriver(storagePath, prefix)

    expect(instanceWithPrefix.path()).to.equal(storagePath)
    expect(instanceWithPrefix.path('justafile.txt')).to.equal(path.join(storagePath, `${prefix}justafile.txt`))
    expect(instanceWithPrefix.path(path.join('subdirectory', 'anotherpath.txt'))).to.equal(path.join(storagePath, 'subdirectory', `${prefix}anotherpath.txt`))
  })

  it('should have working read(Stream) function', async () => {
    const storagePath = path.join('storage', 'files')
    const instance = await getDriver(storagePath)

    const filePath = 'justafile.txt'
    const content = 'This should be the content'
    await util.promisify(mkdirp)(path.dirname(path.join(tempDir, filePath)))
    fs.writeFileSync(path.join(tempDir, filePath), content)

    const readStreamStub = sinon.stub(instance.bucket, 'file')
    readStreamStub.withArgs(instance.path(filePath)).returns({
      createReadStream: async () => fs.createReadStream(path.join(tempDir, filePath))
    } as any)

    expect(await instance.read(filePath)).to.equal(content)
    expect(readStreamStub.calledOnce).equals(true)

    const readStream = await instance.readStream(filePath)
    expect(readStreamStub.calledTwice).equals(true)
    const readStreamContent = await new Promise((resolve, reject) => {
      const chunks: string[] = []
      readStream.on('data', (chunk: Buffer | string) => {
        chunks.push(chunk.toString())
      })
      readStream.on('end', () => {
        resolve(chunks.join(''))
      })
      readStream.on('error', reject)
    })
    expect(readStreamContent).to.equal(content)
  })

  it('should have working write(Stream) function', async () => {
    const storagePath = path.join('storage', 'files')
    const instance = await getDriver(storagePath)

    const filePath = 'subdirectory/justafile.txt'
    const filePath2 = 'subdirectory/justanotherfile.txt'
    const content = 'This should be the content'

    const writeStreamStub = sinon.stub(instance.bucket, 'file')
    writeStreamStub.withArgs(instance.path(filePath)).returns({
      save: async (content: string) => {
        mkdirp.sync(path.dirname(path.join(tempDir, filePath)))
        return fs.writeFileSync(path.join(tempDir, filePath), content)
      }
    } as any)
    writeStreamStub.withArgs(instance.path(filePath2)).returns({
      createWriteStream: async () => {
        mkdirp.sync(path.dirname(path.join(tempDir, filePath2)))
        return fs.createWriteStream(path.join(tempDir, filePath2))
      }
    } as any)

    await instance.write(filePath, content)
    expect(writeStreamStub.calledOnce).equals(true)
    expect(fs.readFileSync(path.join(tempDir, filePath)).toString()).to.equal(content)

    const writeStream = await instance.writeStream(filePath2)
    expect(writeStreamStub.calledTwice).equals(true)
    writeStream.write(content)
    await new Promise((resolve) => {
      writeStream.end(resolve)
    })
    expect(fs.readFileSync(path.join(tempDir, filePath2)).toString()).to.equal(content)
  })

  it('should have working exists function', async () => {
    const storagePath = path.join('storage', 'files')
    const instance = await getDriver(storagePath)

    const filePath = 'subdirectory/justanotherfile.exists.txt'
    const content = 'This should be the content'

    const existsStreamStub = sinon.stub(instance.bucket, 'file')
    existsStreamStub.withArgs(instance.path(filePath)).returns({
      exists: async () => [fs.existsSync(path.join(tempDir, filePath))]
    } as any)

    expect(await instance.exists(filePath)).to.equal(false)
    expect(existsStreamStub.calledOnce).equals(true)
    mkdirp.sync(path.dirname(path.join(tempDir, filePath)))
    fs.writeFileSync(path.join(tempDir, filePath), content)
    expect(await instance.exists(filePath)).to.equal(true)
    expect(existsStreamStub.calledTwice).equals(true)
  })

  it('should have working delete function', async () => {
    const storagePath = path.join('storage', 'files')
    const instance = await getDriver(storagePath)

    const filePath = 'subdirectory/justanotherfile.delete.txt'
    const content = 'This should be the content'

    const removeStreamStub = sinon.stub(instance.bucket, 'file')
    removeStreamStub.withArgs(instance.path(filePath)).returns({
      delete: async () => fs.unlinkSync(path.join(tempDir, filePath))
    } as any)

    mkdirp.sync(path.dirname(path.join(tempDir, filePath)))
    fs.writeFileSync(path.join(tempDir, filePath), content)
    expect(fs.existsSync(path.join(tempDir, filePath))).to.equal(true)
    await instance.remove(filePath)
    expect(removeStreamStub.calledOnce).equals(true)
    expect(fs.existsSync(path.join(tempDir, filePath))).to.equal(false)
  })

  it('should have working move function', async () => {
    const storagePath = path.join('storage', 'files')
    const instance = await getDriver(storagePath)

    const filePath = 'subdirectory/justanotherfile.move.txt'
    const filePath2 = 'subdirectory/justanotherfile.move2.txt'
    const content = 'This should be the content'

    const moveStreamStub = sinon.stub(instance.bucket, 'file')
    moveStreamStub.withArgs(instance.path(filePath)).returns({
      move: async () => fs.renameSync(path.join(tempDir, filePath), path.join(tempDir, filePath2))
    } as any)

    mkdirp.sync(path.dirname(path.join(tempDir, filePath)))
    fs.writeFileSync(path.join(tempDir, filePath), content)
    expect(fs.existsSync(path.join(tempDir, filePath))).to.equal(true)
    expect(fs.existsSync(path.join(tempDir, filePath2))).to.equal(false)
    await instance.move(filePath, filePath2)
    expect(moveStreamStub.calledOnce).equals(true)
    expect(fs.existsSync(path.join(tempDir, filePath))).to.equal(false)
    expect(fs.existsSync(path.join(tempDir, filePath2))).to.equal(true)
    expect(fs.readFileSync(path.join(tempDir, filePath2)).toString()).to.equal(content)
  })

  it('should have working copy function', async () => {
    const storagePath = path.join('storage', 'files')
    const instance = await getDriver(storagePath)

    const filePath = 'subdirectory/justanotherfile.copy.txt'
    const filePath2 = 'subdirectory/justanotherfile.copy2.txt'
    const content = 'This should be the content'

    const copyStreamStub = sinon.stub(instance.bucket, 'file')
    copyStreamStub.withArgs(instance.path(filePath)).returns({
      copy: async () => fs.copyFileSync(path.join(tempDir, filePath), path.join(tempDir, filePath2))
    } as any)

    mkdirp.sync(path.dirname(path.join(tempDir, filePath)))
    fs.writeFileSync(path.join(tempDir, filePath), content)
    expect(fs.existsSync(path.join(tempDir, filePath))).to.equal(true)
    expect(fs.existsSync(path.join(tempDir, filePath2))).to.equal(false)
    await instance.copy(filePath, filePath2)
    expect(copyStreamStub.calledOnce).equals(true)
    expect(fs.existsSync(path.join(tempDir, filePath))).to.equal(true)
    expect(fs.existsSync(path.join(tempDir, filePath2))).to.equal(true)
    expect(fs.readFileSync(path.join(tempDir, filePath)).toString()).to.equal(content)
    expect(fs.readFileSync(path.join(tempDir, filePath2)).toString()).to.equal(content)
  })

})
