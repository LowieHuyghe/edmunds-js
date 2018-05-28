import Edmunds from '../edmunds'

/**
 * Manager abstract class
 */
export default abstract class Manager<T> {
  /**
   * Current application registering the manager to
   */
  protected edmunds: Edmunds

  /**
   * Config of the instances
   */
  private instancesConfig: any[]

  /**
   * List of instances config that is yet to be loaded
   */
  private instancesConfigIndexesYetToBeLoaded: number[]

  /**
   * List of instances
   */
  private instances: { [key: string]: T }

  /**
   * Constructor
   * @param {Edmunds} edmunds
   * @param {any[]} instancesConfig
   */
  constructor (edmunds: Edmunds, instancesConfig: any[]) {
    this.edmunds = edmunds
    this.instancesConfig = instancesConfig
    this.instancesConfigIndexesYetToBeLoaded = Object.keys(instancesConfig).map(key => parseInt(key, 10))

    // If application is long-running, load all instance before-hand
    if (this.edmunds.isLongRunning()) {
      this.loadAll()
    }
  }

  /**
   * Get the instance
   * @param {string} name
   * @returns {T}
   */
  get (name?: string): T {
    if (!name) {
      this.loadFirst()
      return this.instances[this.instancesConfig[0].name]
    }

    this.loadSingle(name)
    return this.instances[name]
  }

  /**
   * Get all instances
   * @returns {T}
   */
  all (): { [key: string]: T } {
    this.loadAll()
    return { ...this.instances }
  }

  /**
   * Load all instances
   */
  protected loadAll () {
    if (!this.instances) {
      this.validate(this.instancesConfig)
      this.instances = {}
    }

    while (this.instancesConfigIndexesYetToBeLoaded.length) {
      const index = this.instancesConfigIndexesYetToBeLoaded.shift()
      const instanceConfig = this.instancesConfig[index]

      this.instances[instanceConfig.name] = this.create(instanceConfig)
    }
  }

  /**
   * Load single instance
   * @param {string} name Load one specific instance
   */
  protected loadSingle (name: string) {
    if (!this.instances) {
      this.validate(this.instancesConfig)
      this.instances = {}
    } else if (name in this.instances) {
      return
    }

    const indexPosition = this.instancesConfigIndexesYetToBeLoaded.findIndex(index => this.instancesConfig[index].name === name)
    if (typeof indexPosition === 'undefined') {
      throw new Error(`No instance declared with name "${name}"`)
    }

    const index = this.instancesConfigIndexesYetToBeLoaded.splice(indexPosition, 1)[0]
    const instanceConfig = this.instancesConfig[index]

    this.instances[instanceConfig.name] = this.create(instanceConfig)
  }

  /**
   * Load first instance
   */
  protected loadFirst () {
    if (!this.instances) {
      this.validate(this.instancesConfig)
      this.instances = {}
    }

    if (!this.instancesConfigIndexesYetToBeLoaded.length || this.instancesConfigIndexesYetToBeLoaded[0] !== 0) {
      return
    }

    const index = this.instancesConfigIndexesYetToBeLoaded.shift()
    const instanceConfig = this.instancesConfig[index]

    this.instances[instanceConfig.name] = this.create(instanceConfig)
  }

  /**
   * Validate the given instancesConfig
   * @param {any[]} instancesConfig
   */
  protected validate (instancesConfig: any[]) {
    if (!instancesConfig.length) {
      throw new Error('No instances declared')
    }

    const uniqueNames: string[] = []
    for (const instanceConfig of instancesConfig) {
      // Validate name
      const name: string = instanceConfig.name
      if (!name) {
        throw new Error('Missing name for declared instance')
      }
      if (uniqueNames.indexOf(name) >= 0) {
        throw new Error(`Re-declaring instance with name "${name}"`)
      }
      uniqueNames.push(name)

      // Validate driver
      const driverKeyName: string = this.resolveDriverKeyName()
      const driver: string = instanceConfig[driverKeyName]
      // Create method
      const createMethodName: string = this.resolveCreateMethodName(driver)
      if (!(createMethodName in this as any)) {
        throw new Error(`Method "${createMethodName}" for driver "${driver}" does not exist`)
      }
      // Destroy method is optional
    }
  }

  /**
   * Create the instance using the config
   * @param config
   * @returns {any}
   */
  protected create (config: any): T {
    const driverKeyName: string = this.resolveDriverKeyName()
    const driver: string = config[driverKeyName]
    const createMethodName: string = this.resolveCreateMethodName(driver)

    let createMethod: (config: any) => any = (this as any)[createMethodName]
    createMethod = createMethod.bind(this)
    return createMethod(config)
  }

  /**
   * Destroy the given config
   * @param config
   * @param {T} instance
   */
  protected destroy (config: any, instance: T): void {
    const driverKeyName: string = this.resolveDriverKeyName()
    const driver: string = config[driverKeyName]
    const destroyMethodName: string = this.resolveDestroyMethodName(driver)

    let destroyMethod: (config: any, instance: T) => any = (this as any)[destroyMethodName]
    if (!destroyMethod) {
      return
    }

    destroyMethod = destroyMethod.bind(this)
    return destroyMethod(config, instance)
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

  /**
   * Resolve the destroy method name
   * @param {string} driver
   * @returns {string}
   */
  protected resolveDestroyMethodName (driver: string) {
    return 'destroy' + driver.charAt(0).toUpperCase() + driver.slice(1).toLowerCase()
  }
}
