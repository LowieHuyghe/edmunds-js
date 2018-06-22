# File system

Edmunds supports multiple file systems by default:
- Ordinary local file storage
- [Google Cloud Storage](https://www.npmjs.com/package/@google-cloud/storage)


## Configuration

Example config:
```json
{
  "filesystem": {
    // File system instances. As many as you like.
    "instances": [
      {
        // Unique name for this instance
        "name": "local", 
        // Name of the driver 
        "driver": "local",
        // Path to the storage relative to the root of the project
        "path": "storage/files",
        // Optional
      	"prefix": "my.file.prefix."
      },
      {
        "name": "googlecloudstorage",
        "driver": "googlecloudstorage",
        // Name of the bucket
        "bucket": "my-bucket-name",
        // Optional
        "path": "storage/files",
      	"prefix": "my.file.prefix."
      }
    ]
  }
}
```


## Usage

Example usage:
```typescript
import * as appRootPath from 'app-root-path'
import {
  Edmunds,
  FileSystemServiceProvider
} from 'edmunds'

const edmunds = new Edmunds(appRootPath.path)

// File system Service Provider
edmunds.register(FileSystemServiceProvider)

// Usage
const firstDriver = await edmunds.fileSystem()
const content = await firstDriver.read('SomeFile.txt')
const readStream = await firstDriver.readStream('SomeFile.txt')

const localDriver = await edmunds.fileSystem('local')
await localDriver.write('SomeOtherFile.txt', 'SomeWildContent')
const writeStream = await localDriver.writeStream('SomeOtherFile.txt')

const googleCloudStorageDriver = await googleCloudStorageDriver
await googleCloudStorageDriver.exists('YetAnotherFile.txt')

await firstDriver.move('FileToMove.txt', 'FileToMoveNewLocation.txt')

await firstDriver.copy('FileToCopy.txt', 'CopyOfFileToCopy.txt')

await googleCloudStorageDriver.remove('YetAnotherFile.txt')
```
