/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3425588055")

  // update field
  collection.fields.addAt(11, new Field({
    "hidden": false,
    "id": "file1204091606",
    "maxSelect": 5,
    "maxSize": 52428800,
    "mimeTypes": [],
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

  // update field
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
})
