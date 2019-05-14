const AppModel = require('../FCModel')

class ModelSubEx extends AppModel {
  fc_propertyMapper() {
    return {
      name: 'name'
    }
  }
}

module.exports = ModelSubEx
