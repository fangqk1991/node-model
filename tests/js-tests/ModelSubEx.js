const { FCModel } = require('../../lib/index')

class ModelSubEx extends FCModel {
  fc_propertyMapper() {
    return {
      name: 'name'
    }
  }
}

module.exports = ModelSubEx
