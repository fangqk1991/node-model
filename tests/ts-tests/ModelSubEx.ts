import { FCModel } from '../../src'

export default class ModelSubEx extends FCModel {
  public name: any

  fc_propertyMapper(): {[p: string]: string} {
    return {
      name: 'name'
    }
  }
}
