import { Edmunds } from '../edmunds'

/**
 * Manager abstract class
 */
export abstract class Manager {
  /**
   * Current application registering the manager to
   */
  protected edmunds: Edmunds

  /**
   * Config of the instances
   */
  private instancesConfig: any[]

  /**
   * List of instances
   */
  private instances: any

  /**
   * Constructor
   * @param {Edmunds} edmunds
   * @param {any[]} instancesConfig
   */
  constructor (edmunds: Edmunds, instancesConfig: any[]) {
    this.edmunds = edmunds
    this.instancesConfig = instancesConfig
  }

  /**
   * Get the instance
   * @param {string} name
   * @returns {any}
   */
  get (name?: string): any {
    this.load()

    if (!name) {
      name = Object.keys(this.instances)[0]
    }

    return this.instances[name]
  }

  /**
   * Get all instances
   * @returns {any}
   */
  all (): any[] {
    this.load()

    return { ...this.instances }
  }

  /**
   * Load the instances
   */
  public load () {
    if (this.instances) {
      return
    }

    const instances: any = {}

    for (let instanceConfig of this.instancesConfig) {
      const name: string = instanceConfig.name
      if (!name) {
        throw Error('Missing name for declared instance')
      }
      if (name in instances) {
        throw Error(`Re-declaring instance with name "${name}"`)
      }
      instances[name] = this.resolve(instanceConfig)
    }

    this.instances = instances
  }

  /**
   * Resolve the instance config
   * @param config
   * @returns {any}
   */
  protected resolve (config: any): any {
    const driverKeyName: string = this.resolveDriverKeyName()
    const driver: string = config[driverKeyName]
    const methodName: string = this.resolveCreateMethodName(driver)

    let method: (config: any) => any = (this as any)[methodName]
    if (!method) {
      throw Error(`Method "${methodName}" for driver "${driver}" does not exist`)
    }
    method = method.bind(this)

    return method(config)
  }

  /**
   * Resolve the driver key name
   * @returns {string}
   */
  protected resolveDriverKeyName () {
    return 'driver'
  }

  /**
   * Resolve the create method name
   * @param {string} driver
   * @returns {string}
   */
  protected resolveCreateMethodName (driver: string) {
    return 'create' + driver.charAt(0).toUpperCase() + driver.slice(1).toLowerCase()
  }
}
