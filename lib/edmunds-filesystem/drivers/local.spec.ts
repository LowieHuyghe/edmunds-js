import Edmunds from '../../edmunds/edmunds'
import FileSystemManager from '../filesystemmanager'
import { expect } from 'chai'
import * as appRootPath from 'app-root-path'
import 'mocha'
import Local from './local'
import * as path from 'path'
import * as os from 'os'
import * as fs from 'fs'
import * as rmdir from 'rmdir'
import * as util from 'util'
import * as mkdirp from 'mkdirp'

describe('Local', () => {
  async function getDriver (root: string, storagePath: string, prefix?: string): Promise<Local> {
    const config = [{
      name: 'local',
      driver: 'local',
      prefix: prefix,
      path: storagePath
    }]

    const edmunds = new Edmunds(root)
    const manager = new FileSystemManager(edmunds, config)

    const instance = await manager.get()
    expect(instance).to.be.an.instanceof(Local)
    return instance as Local
  }

  const tempDirs: string[] = []
  afterEach(async () => {
    while (tempDirs.length) {
      const tempDir = tempDirs.pop()
      if (fs.existsSync(tempDir)) {
        await new Promise((resolve, reject) => {
          rmdir(tempDir, (err: Error) => {
            if (err) {
              reject(err)
            } else {
              resolve()
            }
          })
        })
      }
    }
  })

  it('should have working path function', async () => {
    const root = appRootPath.path
    const storagePath = path.join('storage', 'files')
    const instance = await getDriver(root, storagePath)

    expect(instance.path()).to.equal(path.join(root, storagePath))
    expect(instance.path('justafile.txt')).to.equal(path.join(root, storagePath, 'justafile.txt'))
    expect(instance.path(path.join('subdirectory', 'anotherpath.txt'))).to.equal(path.join(root, storagePath, 'subdirectory', 'anotherpath.txt'))

    const prefix = 'prefix.is.nice.'
    const instanceWithPrefix = await getDriver(root, storagePath, prefix)

    expect(instanceWithPrefix.path()).to.equal(path.join(root, storagePath))
    expect(instanceWithPrefix.path('justafile.txt')).to.equal(path.join(root, storagePath, `${prefix}justafile.txt`))
    expect(instanceWithPrefix.path(path.join('subdirectory', 'anotherpath.txt'))).to.equal(path.join(root, storagePath, 'subdirectory', `${prefix}anotherpath.txt`))
  })

  it('should have working read(Stream) function', async () => {
    const root = path.join(os.tmpdir(), 'testing-edmunds')
    tempDirs.push(root)
    const storagePath = path.join('storage', 'files')
    const instance = await getDriver(root, storagePath)

    const filePath = 'justafile.txt'
    const content = 'This should be the content'
    await util.promisify(mkdirp)(path.dirname(instance.path(filePath)))
    fs.writeFileSync(instance.path(filePath), content)

    expect(await instance.read(filePath)).to.equal(content)

    const readStream = await instance.readStream(filePath)
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
    const root = path.join(os.tmpdir(), 'testing-edmunds')
    tempDirs.push(root)
    const storagePath = path.join('storage', 'files')
    const instance = await getDriver(root, storagePath)

    const filePath = 'subdirectory/justafile.txt'
    const filePath2 = 'subdirectory/justanotherfile.txt'
    const content = 'This should be the content'

    await instance.write(filePath, content)
    expect(fs.readFileSync(instance.path(filePath)).toString()).to.equal(content)

    const writeStream = await instance.writeStream(filePath2)
    writeStream.write(content)
    await new Promise((resolve) => {
      writeStream.end(resolve)
    })
    expect(fs.readFileSync(instance.path(filePath2)).toString()).to.equal(content)
  })

  it('should have working exists function', async () => {
    const root = path.join(os.tmpdir(), 'testing-edmunds')
    tempDirs.push(root)
    const storagePath = path.join('storage', 'files')
    const instance = await getDriver(root, storagePath)

    const filePath = 'subdirectory/justanotherfile.exists.txt'
    const content = 'This should be the content'

    expect(await instance.exists(filePath)).to.equal(false)
    await instance.write(filePath, content)
    expect(await instance.exists(filePath)).to.equal(true)
  })

  it('should have working delete function', async () => {
    const root = path.join(os.tmpdir(), 'testing-edmunds')
    tempDirs.push(root)
    const storagePath = path.join('storage', 'files')
    const instance = await getDriver(root, storagePath)

    const filePath = 'subdirectory/justanotherfile.delete.txt'
    const content = 'This should be the content'

    await instance.write(filePath, content)
    expect(await instance.exists(filePath)).to.equal(true)
    await instance.remove(filePath)
    expect(await instance.exists(filePath)).to.equal(false)
  })

  it('should have working move function', async () => {
    const root = path.join(os.tmpdir(), 'testing-edmunds')
    tempDirs.push(root)
    const storagePath = path.join('storage', 'files')
    const instance = await getDriver(root, storagePath)

    const filePath = 'subdirectory/justanotherfile.move.txt'
    const filePath2 = 'subdirectory/justanotherfile.move2.txt'
    const content = 'This should be the content'

    await instance.write(filePath, content)
    expect(await instance.exists(filePath)).to.equal(true)
    expect(await instance.exists(filePath2)).to.equal(false)
    await instance.move(filePath, filePath2)
    expect(await instance.exists(filePath)).to.equal(false)
    expect(await instance.exists(filePath2)).to.equal(true)
    expect(await instance.read(filePath2)).to.equal(content)
  })

  it('should have working copy function', async () => {
    const root = path.join(os.tmpdir(), 'testing-edmunds')
    tempDirs.push(root)
    const storagePath = path.join('storage', 'files')
    const instance = await getDriver(root, storagePath)

    const filePath = 'subdirectory/justanotherfile.copy.txt'
    const filePath2 = 'subdirectory/justanotherfile.copy2.txt'
    const content = 'This should be the content'

    await instance.write(filePath, content)
    expect(await instance.exists(filePath)).to.equal(true)
    expect(await instance.exists(filePath2)).to.equal(false)
    await instance.copy(filePath, filePath2)
    expect(await instance.exists(filePath)).to.equal(true)
    expect(await instance.exists(filePath2)).to.equal(true)
    expect(await instance.read(filePath)).to.equal(content)
    expect(await instance.read(filePath2)).to.equal(content)
  })

})
