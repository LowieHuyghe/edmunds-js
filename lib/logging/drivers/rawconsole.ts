import * as Transport from 'winston-transport'
import { LEVEL, MESSAGE } from 'triple-beam'

export class RawConsole extends Transport {
  constructor (opts: any) {
    super(opts)
  }

  log (info: any, callback: () => void) {
    setImmediate(() => this.emit('logged', info))

    const level: string = info[LEVEL]
    const message: string = info[MESSAGE]

    switch (level) {
      case 'error':
        console.error(message)
        break
      case 'warn':
        console.warn(message)
        break
      case 'info':
        console.info(message)
        break
      case 'debug':
        console.debug(message)
        break
      default:
        console.log(message)
        break
    }

    if (callback) {
      callback()
    }
  }
}
