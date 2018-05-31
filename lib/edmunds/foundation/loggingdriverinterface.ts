
// This is an interface based on some basic functionality of
// winston.LoggerInstance. This file is merely here so the main
// 'edmunds' package does not need the whole library.

export default interface LoggerInstance extends NodeJS.EventEmitter {
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
  (level: string, msg: string, callback: LogCallback): LoggerInstance
  (level: string, msg: string, meta: any, callback: LogCallback): LoggerInstance
  (level: string, msg: string, ...meta: any[]): LoggerInstance
}

export interface LeveledLogMethod {
  (msg: string, callback: LogCallback): LoggerInstance
  (msg: string, meta: any, callback: LogCallback): LoggerInstance
  (msg: string, ...meta: any[]): LoggerInstance
}

export type LogCallback = (error?: any, level?: string, msg?: string, meta?: any) => void
