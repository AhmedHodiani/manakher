/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2151097168")

  // add field
  collection.fields.addAt(10, new Field({
    "hidden": false,
    "id": "number3647065606",
    "max": null,
    "min": null,
    "name": "previous_score",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2151097168")

  // remove field
  collection.fields.removeById("number3647065606")

  return app.save(collection)
})
