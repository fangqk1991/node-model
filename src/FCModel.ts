interface MapProtocol {
  [p: string]: any;
}

export class FCModel implements MapProtocol {
  fc_defaultInit(): void {}
  // eslint-disable-next-line no-unused-vars,@typescript-eslint/no-unused-vars
  fc_afterGenerate(data: {[p: string]: any} = {}): void {}

  fc_propertyMapper(): {[p: string]: string} {
    throw new Error(`You must override the perform method.`)
  }

  constructor () {
    this.fc_defaultInit()
  }

  fc_generate(data: {[p: string]: any}): void {
    const propertyMap = this.fc_propertyMapper()
    const propertyClassMap = this.fc_propertyClassMapper()
    const itemClassMap = this.fc_arrayItemClassMapper()

    for (const property in propertyMap) {
      const jsonKey = propertyMap[property]
      if (jsonKey in data) {
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
    }

    this.fc_afterGenerate(data)
  }

  fc_encode(): { [p: string]: any } {
    const propertyMap = this.fc_propertyMapper()
    const propertyClassMap = this.fc_propertyClassMapper()
    const itemClassMap = this.fc_arrayItemClassMapper()

    const data: {[p: string]: any} = {}
    for (const property in propertyMap) {
      const jsonKey = propertyMap[property]
      if (property in this) {
        const entity = (this as MapProtocol)[property]
        if (property in propertyClassMap && entity instanceof FCModel) {
          data[jsonKey] = entity.fc_retMap()
        } else if (property in itemClassMap && Array.isArray(entity)) {
          data[jsonKey] = entity.map((item): {} => item.fc_retMap())
        } else {
          data[jsonKey] = entity
        }
      }
    }

    return data
  }

  fc_retMap(): { [p: string]: any } {
    return this.fc_encode()
  }

  fc_propertyClassMapper(): {[p: string]: { new(): FCModel }} {
    return {}
  }

  fc_arrayItemClassMapper(): {[p: string]: { new(): FCModel }} {
    return {}
  }
}
