function objectFromClass(Clazz) {
  const a = {
    Clazz: Clazz
  }
  return new a['Clazz']()
}

class FCModel {
  fc_defaultInit() {}
  fc_afterGenerate(data = {}) {}

  /**
   * @returns {Object}
   */
  fc_propertyMapper() {
    throw new Error(`You must override the perform method.`)
  }

  constructor () {
    this.fc_defaultInit()
  }

  fc_generate(data) {
    const propertyMap = this.fc_propertyMapper()
    const propertyClassMap = this.fc_propertyClassMapper()
    const itemClassMap = this.fc_arrayItemClassMapper()

    for (const property in propertyMap) {
      if (propertyMap.hasOwnProperty(property)) {
        const jsonKey = propertyMap[property]
        if (property in propertyClassMap && typeof data[jsonKey] === 'object') {
          const obj = objectFromClass(propertyClassMap[property])
          if (obj instanceof FCModel) {
            obj.fc_generate(data[jsonKey])
            this[property] = obj
          }
        } else if (property in itemClassMap && Array.isArray(data[jsonKey])) {
          const arr = []
          data[jsonKey].forEach(dic => {
            const obj = objectFromClass(itemClassMap[property])
            if (obj instanceof FCModel) {
              obj.fc_generate(dic)
              arr.push(obj)
            } else {
              arr.push(null)
            }
          })
          this[property] = arr
        } else {
          this[property] = data[jsonKey]
        }
      }
    }

    this.fc_afterGenerate(data)
  }

  fc_encode() {
    const propertyMap = this.fc_propertyMapper()
    const propertyClassMap = this.fc_propertyClassMapper()
    const itemClassMap = this.fc_arrayItemClassMapper()

    const data = {}
    for (const property in propertyMap) {
      if (propertyMap.hasOwnProperty(property)) {
        const jsonKey = propertyMap[property]
        if (property in this) {
          const entity = this[property]
          if (property in propertyClassMap && entity instanceof FCModel) {
            data[jsonKey] = entity.fc_retMap()
          } else if (property in itemClassMap && Array.isArray(entity)) {
            data[jsonKey] = entity.map(item => item.fc_retMap())
          } else {
            data[jsonKey] = entity
          }
        }
      }
    }

    return data
  }

  fc_retMap() {
    return this.fc_encode()
  }

  fc_propertyClassMapper() {
    return {}
  }

  fc_arrayItemClassMapper() {
    return {}
  }
}

module.exports = FCModel
