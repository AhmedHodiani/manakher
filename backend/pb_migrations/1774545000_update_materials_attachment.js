/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const materialsCollection = app.findCollectionByNameOrId("pbc_4282183725")
  const mediaCollection = app.findCollectionByNameOrId("media")

  if (!mediaCollection) {
    throw new Error("Media collection not found")
  }

  // Add attachment relation field
  materialsCollection.fields.addAt(materialsCollection.fields.length, new Field({
    "cascadeDelete": false,
    "collectionId": mediaCollection.id,
    "hidden": false,
    "id": "relation_" + Date.now() + "_" + Math.floor(Math.random() * 10000),
    "maxSelect": 1,
    "minSelect": 0,
    "name": "attachment",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  // Add attachment_name text field
  materialsCollection.fields.addAt(materialsCollection.fields.length, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text_" + Date.now() + "_" + Math.floor(Math.random() * 10000),
    "max": 0,
    "min": 0,
    "name": "attachment_name",
    "pattern": "",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  return app.save(materialsCollection)
}, (app) => {
  const materialsCollection = app.findCollectionByNameOrId("pbc_4282183725")

  // Remove attachment_name field
  const attachmentNameField = materialsCollection.fields.find(f => f.name === "attachment_name")
  if (attachmentNameField) {
    materialsCollection.fields.removeById(attachmentNameField.id)
  }

  // Remove attachment field
  const attachmentField = materialsCollection.fields.find(f => f.name === "attachment")
  if (attachmentField) {
    materialsCollection.fields.removeById(attachmentField.id)
  }

  return app.save(materialsCollection)
})