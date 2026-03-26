/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("_pb_users_auth_")

  // remove field
  collection.fields.removeById("relation762542831")

  // update field
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

  // update field
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

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("_pb_users_auth_")

  // add field
  collection.fields.addAt(10, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_3098803551",
    "hidden": false,
    "id": "relation762542831",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "section",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  // update field
  collection.fields.addAt(8, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_3098803551",
    "hidden": false,
    "id": "relation731267992",
    "maxSelect": 0,
    "minSelect": 0,
    "name": "sections",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  // update field
  collection.fields.addAt(9, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_3949707534",
    "hidden": false,
    "id": "relation2871367959",
    "maxSelect": 0,
    "minSelect": 0,
    "name": "subjects",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  return app.save(collection)
})
