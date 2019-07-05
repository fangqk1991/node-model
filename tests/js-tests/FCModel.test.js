const ModelMainEx = require('./ModelMainEx')
const ModelSubEx = require('./ModelSubEx')
const assert = require('assert')

describe('Test FCModel', () => {
  it(`Test normal`, async () => {
    const data = {
      xyy: 1,
      xxx_yyy: 'hehehe',
      xxx: 'ttt',
      sub_obj: {
        name: 'Sub - Obj',
      },
      sub_items: [
        { name: 'Sub - Obj - 1' },
        { name: 'Sub - Obj - 2' },
        { name: 'Sub - Obj - 3' },
      ]
    }

    const obj = new ModelMainEx()
    obj.fc_generate(data)

    assert.ok(obj.xyy === data['xyy'])
    assert.ok(obj.xxxYYY === data['xxx_yyy'])
    assert.ok(!obj.xxx)
    assert.ok(obj.subObj instanceof ModelSubEx && obj.subObj.name === data['sub_obj']['name'])
    assert.ok(Array.isArray(obj.subItems) && obj.subItems.length === data['sub_items'].length)

    const retMap = obj.fc_retMap()
    assert.ok(retMap['xyy'] === data['xyy'])
    assert.ok(retMap['xxx_yyy'] === data['xxx_yyy'])
    assert.ok(!retMap['xxx'])
  })
})
