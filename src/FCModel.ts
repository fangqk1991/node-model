interface MapProtocol {
  [p: string]: any;
}

export class FCModel implements MapProtocol {
  /**
   * @description It will be executed in constructor
   */
  fc_defaultInit(): void {}

  // eslint-disable-next-line no-unused-vars,@typescript-eslint/no-unused-vars
  fc_afterGenerate(data: {[p: string]: any} = {}): void {}

  /**
   * @description Mapping table for (class-property => data-json-key)
   */
  fc_propertyMapper(): {[p: string]: string} {
    throw new Error(`You must override the perform method.`)
  }

  constructor () {
    const _this = this as any
    const propertyList = Object.keys(this.fc_propertyMapper())
    propertyList.forEach((property: string) => {
      _this[property] = undefined
    })
    this.fc_defaultInit()
  }

  /**
   * @description Pass json data to build properties of the instance.
   * @param data
   */
  public fc_generate(data: {[p: string]: any}): void {
    const propertyMap = this.fc_propertyMapper()
    const propertyClassMap = this.fc_propertyClassMapper()
    const itemClassMap = this.fc_arrayItemClassMapper()

    for (const property in propertyMap) {
      const jsonKey = propertyMap[property]

      if (property in propertyClassMap && data[jsonKey] !== null && typeof data[jsonKey] === 'object') {
        const obj = new propertyClassMap[property]()
        if (obj instanceof FCModel) {
          obj.fc_generate(data[jsonKey])
          const _this = this as MapProtocol
          _this[property] = obj
        }
      } else if (property in itemClassMap && Array.isArray(data[jsonKey])) {
        const arr: any[] = []
        data[jsonKey].forEach((dic: {}): void => {
          const obj = new itemClassMap[property]()
          if (obj instanceof FCModel) {
            obj.fc_generate(dic)
            arr.push(obj)
          } else {
            arr.push(null)
          }
        })
        const _this = this as MapProtocol
        _this[property] = arr
      } else {
        const _this = this as MapProtocol
        _this[property] = data[jsonKey]
      }
    }

    this.fc_afterGenerate(data)
  }

  private _encode(forProperties: boolean = false) {
    const propertyMap = this.fc_propertyMapper()
    const propertyClassMap = this.fc_propertyClassMapper()
    const itemClassMap = this.fc_arrayItemClassMapper()

    const data: {[p: string]: any} = {}
    for (const property in propertyMap) {
      const targetKey = forProperties ? property : propertyMap[property]
      if (property in this) {
        const entity = (this as MapProtocol)[property]
        if (property in propertyClassMap && entity instanceof FCModel) {
          data[targetKey] = forProperties ? entity.fc_pureModel() : entity.fc_retMap()
        } else if (property in itemClassMap && Array.isArray(entity)) {
          data[targetKey] = entity.map((item): {} => {
            return forProperties ? item.fc_pureModel() : item.fc_retMap()
          })
        } else {
          data[targetKey] = entity
        }
      }
    }

    return data
  }

  /**
   * @description Export JSON data, keys as fc_propertyMapper()'s values
   */
  public fc_encode(): { [p: string]: any } {
    return this._encode(false)
  }

  /**
   * @description Export pure model data, keys as fc_propertyMapper()'s keys
   */
  public fc_pureModel(): { [p: string]: any } {
    return this._encode(true)
  }

  /**
   * @deprecated
   * @description Same as fc_encode
   */
  public fc_retMap(): { [p: string]: any } {
    return this.fc_encode()
  }

  /**
   * @description If some property is FCModel's sub class instance, declare the class in this mapper.
   */
  public fc_propertyClassMapper(): {[p: string]: { new(): FCModel }} {
    return {}
  }

  /**
   * @description If some property is an array of FCModel's sub class instance, declare the class in this mapper.
   */
  public fc_arrayItemClassMapper(): {[p: string]: { new(): FCModel }} {
    return {}
  }
}
