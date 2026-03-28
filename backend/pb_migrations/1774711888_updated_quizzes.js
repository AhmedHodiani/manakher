/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_93315167")

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

  // add field
  collection.fields.addAt(12, new Field({
    "hidden": false,
    "id": "select2063623452",
    "maxSelect": 0,
    "name": "status",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "select",
    "values": [
      "open",
      "closed"
    ]
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_93315167")

  // remove field
  collection.fields.removeById("file1204091606")

  // remove field
  collection.fields.removeById("select2063623452")

  return app.save(collection)
})
