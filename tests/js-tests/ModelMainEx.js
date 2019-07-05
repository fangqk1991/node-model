const { FCModel } = require('../../lib/index')
const ModelSubEx = require('./ModelSubEx')

class ModelMainEx extends FCModel {
  constructor() {
    super()
    this.xyy = null
    this.xxxYYY = null
    this.subObj = null
    this.subItems = null
  }

  fc_propertyMapper() {
    return {
      xyy: 'xyy',
      xxxYYY: 'xxx_yyy',
      subObj: 'sub_obj',
      subItems: 'sub_items',
    }
  }

  fc_propertyClassMapper() {
    return {
      subObj: ModelSubEx,
    }
  }

  fc_arrayItemClassMapper() {
    return {
      subItems: ModelSubEx,
    }
  }
}

module.exports = ModelMainEx
