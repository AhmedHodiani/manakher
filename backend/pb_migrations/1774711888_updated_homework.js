/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3425588055")

  // add field
  collection.fields.addAt(10, new Field({
    "hidden": false,
    "id": "number2586327046",
    "max": null,
    "min": null,
    "name": "total_grade",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  // add field
  collection.fields.addAt(11, new Field({
    "hidden": false,
    "id": "file1204091606",
    "maxSelect": 5,
    "maxSize": 0,
    "mimeTypes": null,
    "name": "attachments",
    "presentable": false,
    "protected": false,
    "required": false,
    "system": false,
    "thumbs": null,
    "type": "file"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3425588055")

  // remove field
  collection.fields.removeById("number2586327046")

  // remove field
  collection.fields.removeById("file1204091606")

  return app.save(collection)
})
