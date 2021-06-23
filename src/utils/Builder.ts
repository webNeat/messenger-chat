type Data = Record<string, any>
/**
 * A generic Builder class to create some an object of type T and return it using the get() method.
 * The internal data is U that gets transformed to T by the get() method.
 */
export abstract class Builder<T extends Data, U extends Data = T> {
  protected data: U

  constructor(data: U) {
    this.data = data
  }

  public get(): T {
    this.validate()
    return this.build()
  }

  protected clone(data: Partial<U>): this {
    return new (this.constructor as any)({...this.data, ...data})
  }

  /**
   * Checks if the this.data is complete and throws an error if not.
   */
  protected abstract validate(): void

  /**
   * Transforms this.data to an object of type T.
   */
  protected abstract build(): T
}
