import * as Transport from 'winston-transport'

export class RawConsole extends Transport {
  constructor (opts: any) {
    super(opts)
  }

  log (info: any, callback: () => void) {
    setImmediate(() => this.emit('logged', info))

    const { level, message } = info

    switch (level) {
      case 'error':
      case 'emerg':
      case 'crit':
        console.error(message)
        break
      case 'warn':
      case 'alert':
      case 'warning':
        console.warn(message)
        break
      case 'info':
      case 'notice':
        console.info(message)
        break
      case 'debug':
      case 'silly':
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
