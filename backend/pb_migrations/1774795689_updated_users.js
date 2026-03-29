/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("_pb_users_auth_")

  // update collection data
  unmarshal({
    "oauth2": {
      "mappedFields": {
        "avatarURL": ""
      }
    }
  }, collection)

  // remove field
  collection.fields.removeById("text1293591439")

  // remove field
  collection.fields.removeById("text1031224004")

  // remove field
  collection.fields.removeById("file376926767")

  // remove field
  collection.fields.removeById("select1466534506")

  // remove field
  collection.fields.removeById("relation731267992")

  // remove field
  collection.fields.removeById("relation2871367959")

  // add field
  collection.fields.addAt(1, new Field({
    "hidden": false,
    "id": "select2063623452",
    "maxSelect": 0,
    "name": "status",
    "presentable": true,
    "required": true,
    "system": false,
    "type": "select",
    "values": [
      "active",
      "suspended"
    ]
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("_pb_users_auth_")

  // update collection data
  unmarshal({
    "oauth2": {
      "mappedFields": {
        "avatarURL": "avatar"
      }
    }
  }, collection)

  // add field
  collection.fields.addAt(4, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text1293591439",
    "max": 0,
    "min": 0,
    "name": "name_ar",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": true,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(5, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text1031224004",
    "max": 0,
    "min": 0,
    "name": "name_en",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": true,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(6, new Field({
    "hidden": false,
    "id": "file376926767",
    "maxSelect": 0,
    "maxSize": 0,
    "mimeTypes": null,
    "name": "avatar",
    "presentable": false,
    "protected": false,
    "required": false,
    "system": false,
    "thumbs": null,
    "type": "file"
  }))

  // add field
  collection.fields.addAt(7, new Field({
    "hidden": false,
    "id": "select1466534506",
    "maxSelect": 0,
    "name": "role",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "select",
    "values": [
      "admin",
      "teacher",
      "student"
    ]
  }))

  // add field
  collection.fields.addAt(8, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_3098803551",
    "hidden": false,
    "id": "relation731267992",
    "maxSelect": 999,
    "minSelect": 0,
    "name": "sections",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  // add field
  collection.fields.addAt(9, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_3949707534",
    "hidden": false,
    "id": "relation2871367959",
    "maxSelect": 999,
    "minSelect": 0,
    "name": "subjects",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  // remove field
  collection.fields.removeById("select2063623452")

  return app.save(collection)
})
