/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2874626212")

  // update field
  collection.fields.addAt(4, new Field({
    "hidden": false,
    "id": "number2718152672",
    "max": null,
    "min": null,
    "name": "correct_answer",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2874626212")

  // update field
  collection.fields.addAt(4, new Field({
    "hidden": false,
    "id": "number2718152672",
    "max": null,
    "min": null,
    "name": "correct_answer",
    "onlyInt": false,
    "presentable": false,
    "required": true,
    "system": false,
    "type": "number"
  }))

  return app.save(collection)
})
