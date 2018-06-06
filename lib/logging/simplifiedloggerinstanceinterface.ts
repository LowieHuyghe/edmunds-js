
// This is an interface based on some basic functionality of
// winston.LoggerInstance. This file is merely here so the main
// 'edmunds' package does not need the whole library.

export default interface SimplifiedLoggerInstanceInterface extends NodeJS.EventEmitter {
  log: LogMethod

  // for cli levels
  error: LeveledLogMethod
  warn: LeveledLogMethod
  help: LeveledLogMethod
  data: LeveledLogMethod
  info: LeveledLogMethod
  debug: LeveledLogMethod
  prompt: LeveledLogMethod
  verbose: LeveledLogMethod
  input: LeveledLogMethod
  silly: LeveledLogMethod

  // for syslog levels only
  emerg: LeveledLogMethod
  alert: LeveledLogMethod
  crit: LeveledLogMethod
  warning: LeveledLogMethod
  notice: LeveledLogMethod
}

export interface LogMethod {
  (level: string, msg: string, callback: LogCallback): SimplifiedLoggerInstanceInterface
  (level: string, msg: string, meta: any, callback: LogCallback): SimplifiedLoggerInstanceInterface
  (level: string, msg: string, ...meta: any[]): SimplifiedLoggerInstanceInterface
}

export interface LeveledLogMethod {
  (msg: string, callback: LogCallback): SimplifiedLoggerInstanceInterface
  (msg: string, meta: any, callback: LogCallback): SimplifiedLoggerInstanceInterface
  (msg: string, ...meta: any[]): SimplifiedLoggerInstanceInterface
}

export type LogCallback = (error?: any, level?: string, msg?: string, meta?: any) => void
