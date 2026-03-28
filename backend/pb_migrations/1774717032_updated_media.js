/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2708086759")

  // update field
  collection.fields.addAt(1, new Field({
    "hidden": false,
    "id": "file2359244304",
    "maxSelect": 1,
    "maxSize": 104857600,
    "mimeTypes": [],
    "name": "file",
    "presentable": false,
    "protected": false,
    "required": true,
    "system": false,
    "thumbs": null,
    "type": "file"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2708086759")

  // update field
  collection.fields.addAt(1, new Field({
    "hidden": false,
    "id": "file2359244304",
    "maxSelect": 1,
    "maxSize": 10485760,
    "mimeTypes": null,
    "name": "file",
    "presentable": false,
    "protected": false,
    "required": true,
    "system": false,
    "thumbs": null,
    "type": "file"
  }))

  return app.save(collection)
})
