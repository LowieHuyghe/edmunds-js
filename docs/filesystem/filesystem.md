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
await edmunds.register(FileSystemServiceProvider)

// Usage
const content = await edmunds.fileSystem().read('SomeFile.txt')
const readStream = await edmunds.fileSystem().readStream('SomeFile.txt')

await edmunds.fileSystem('local').write('SomeOtherFile.txt', 'SomeWildContent')
const writeStream = await edmunds.fileSystem('local').writeStream('SomeOtherFile.txt')

await edmunds.fileSystem('googlecloudstorage').exists('YetAnotherFile.txt')

await edmunds.fileSystem().move('FileToMove.txt', 'FileToMoveNewLocation.txt')

await edmunds.fileSystem().copy('FileToCopy.txt', 'CopyOfFileToCopy.txt')

await edmunds.fileSystem('googlecloudstorage').remove('YetAnotherFile.txt')
```
