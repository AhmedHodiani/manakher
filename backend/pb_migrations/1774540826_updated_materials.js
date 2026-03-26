/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_4282183725")

  // remove field
  collection.fields.removeById("select2363381545")

  // remove field
  collection.fields.removeById("url3087911061")

  // add field
  collection.fields.addAt(3, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text7030390895",
    "max": 0,
    "min": 0,
    "name": "link_url",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_4282183725")

  // add field
  collection.fields.addAt(3, new Field({
    "hidden": false,
    "id": "select2363381545",
    "maxSelect": 0,
    "name": "type",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "select",
    "values": [
      "text",
      "file",
      "link",
      "video"
    ]
  }))

  // add field
  collection.fields.addAt(4, new Field({
    "exceptDomains": null,
    "hidden": false,
    "id": "url3087911061",
    "name": "link_url",
    "onlyDomains": null,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "url"
  }))

  // remove field
  collection.fields.removeById("text7030390895")

  return app.save(collection)
})
