/**
 * Static constructor for referring to own class in static method
 */
export default interface Constructor<M> {
  new (...args: any[]): M
}
