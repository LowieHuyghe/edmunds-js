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
      case 'alert':
      case 'crit':
        console.error(message)
        break
      case 'warn':
      case 'warning':
        console.warn(message)
        break
      case 'info':
      case 'notice':
        console.info(message)
        break
      case 'verbose':
        console.log(message)
        break
      case 'debug':
      case 'silly':
      default:
        console.debug(message)
        break
    }

    if (callback) {
      callback()
    }
  }
}
