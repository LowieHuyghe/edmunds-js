# Logging

Edmunds uses [winston](https://github.com/winstonjs/winston) for
logging. The logging and transporters can be set using configuration.
Using the service provider we enable the module.


## Configuration

Example config:
```json
{
  "logging": {
    // Enable or disable winston logging
    "enabled": true,
    // Transporter instances. As many as you like.
    "instances": [
      {
        // Unique name for this instance
        "name": "console", 
        // Name of the transporter (resolves to winston.transporters.Console) 
        "driver": "Console"
      },
      {
        "name": "file",
        "driver": "File",
        // Configuring the transporter. Everything will be passed to the transporter on construction.
        "filename": "./storage/logs/error-log.txt",
        "level": "error"
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
  LoggingServiceProvider
} from 'edmunds'

const edmunds = new Edmunds(appRootPath.path)

// Logging Service Provider
await edmunds.register(LoggingServiceProvider)

// Default winston usage
edmunds.logger.info('Hello again distributed logs')
```

Documentation can be found on the
[winston-github-page](https://github.com/winstonjs/winston#table-of-contents).
