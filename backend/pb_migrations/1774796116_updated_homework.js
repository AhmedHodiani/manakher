/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3425588055")

  // remove field
  collection.fields.removeById("select517487686")

  // remove field
  collection.fields.removeById("autodate2990389176")

  // remove field
  collection.fields.removeById("autodate3332085495")

  // remove field
  collection.fields.removeById("number2586327046")

  // add field
  collection.fields.addAt(8, new Field({
    "hidden": false,
    "id": "bool2287856061",
    "name": "hidden",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "bool"
  }))

  // update field
  collection.fields.addAt(3, new Field({
    "hidden": false,
    "id": "date3866337329",
    "max": "",
    "min": "",
    "name": "due_date",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "date"
  }))

  // update field
  collection.fields.addAt(4, new Field({
    "cascadeDelete": false,
    "collectionId": "_pb_users_auth_",
    "hidden": false,
    "id": "relation2968954581",
    "maxSelect": 0,
    "minSelect": 0,
    "name": "teacher",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "relation"
  }))

  // update field
  collection.fields.addAt(5, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_3098803551",
    "hidden": false,
    "id": "relation762542831",
    "maxSelect": 0,
    "minSelect": 0,
    "name": "section",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "relation"
  }))

  // update field
  collection.fields.addAt(6, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_3949707534",
    "hidden": false,
    "id": "relation4224597626",
    "maxSelect": 0,
    "minSelect": 0,
    "name": "subject",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "relation"
  }))

  // update field
  collection.fields.addAt(7, new Field({
    "hidden": false,
    "id": "file1204091606",
    "maxSelect": 99,
    "maxSize": 104857600,
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

  // add field
  collection.fields.addAt(4, new Field({
    "hidden": false,
    "id": "select517487686",
    "maxSelect": 0,
    "name": "submission_type",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "select",
    "values": [
      "online",
      "onsite"
    ]
  }))

  // add field
  collection.fields.addAt(8, new Field({
    "hidden": false,
    "id": "autodate2990389176",
    "name": "created",
    "onCreate": true,
    "onUpdate": false,
    "presentable": false,
    "system": false,
    "type": "autodate"
  }))

  // add field
  collection.fields.addAt(9, new Field({
    "hidden": false,
    "id": "autodate3332085495",
    "name": "updated",
    "onCreate": true,
    "onUpdate": true,
    "presentable": false,
    "system": false,
    "type": "autodate"
  }))

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

  // remove field
  collection.fields.removeById("bool2287856061")

  // update field
  collection.fields.addAt(3, new Field({
    "hidden": false,
    "id": "date3866337329",
    "max": "",
    "min": "",
    "name": "due_date",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "date"
  }))

  // update field
  collection.fields.addAt(5, new Field({
    "cascadeDelete": false,
    "collectionId": "_pb_users_auth_",
    "hidden": false,
    "id": "relation2968954581",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "teacher",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "relation"
  }))

  // update field
  collection.fields.addAt(6, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_3098803551",
    "hidden": false,
    "id": "relation762542831",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "section",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "relation"
  }))

  // update field
  collection.fields.addAt(7, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_3949707534",
    "hidden": false,
    "id": "relation4224597626",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "subject",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "relation"
  }))

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
})
