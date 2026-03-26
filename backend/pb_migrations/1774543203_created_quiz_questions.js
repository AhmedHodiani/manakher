/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = new Collection({
    "createRule": "@request.auth.role = \"teacher\" || @request.auth.role = \"admin\"",
    "deleteRule": "@request.auth.role = \"teacher\" || @request.auth.role = \"admin\"",
    "fields": [
      {
        "autogeneratePattern": "[a-z0-9]{15}",
        "hidden": false,
        "id": "text3208210256",
        "max": 15,
        "min": 15,
        "name": "id",
        "pattern": "^[a-z0-9]+$",
        "presentable": false,
        "primaryKey": true,
        "required": true,
        "system": true,
        "type": "text"
      },
      {
        "cascadeDelete": true,
        "collectionId": "pbc_93315167",
        "hidden": false,
        "id": "relation2752707218",
        "maxSelect": 1,
        "minSelect": 0,
        "name": "quiz",
        "presentable": false,
        "required": true,
        "system": false,
        "type": "relation"
      },
      {
        "convertURLs": false,
        "hidden": false,
        "id": "editor1701136936",
        "maxSize": 0,
        "name": "question_text",
        "presentable": false,
        "required": true,
        "system": false,
        "type": "editor"
      },
      {
        "hidden": false,
        "id": "json3493198471",
        "maxSize": 0,
        "name": "options",
        "presentable": false,
        "required": true,
        "system": false,
        "type": "json"
      },
      {
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
      },
      {
        "hidden": false,
        "id": "number4113142680",
        "max": null,
        "min": null,
        "name": "order",
        "onlyInt": false,
        "presentable": false,
        "required": false,
        "system": false,
        "type": "number"
      },
      {
        "hidden": false,
        "id": "autodate2990389176",
        "name": "created",
        "onCreate": true,
        "onUpdate": false,
        "presentable": false,
        "system": false,
        "type": "autodate"
      },
      {
        "hidden": false,
        "id": "autodate3332085495",
        "name": "updated",
        "onCreate": true,
        "onUpdate": true,
        "presentable": false,
        "system": false,
        "type": "autodate"
      }
    ],
    "id": "pbc_2874626212",
    "indexes": [],
    "listRule": "@request.auth.id != \"\"",
    "name": "quiz_questions",
    "system": false,
    "type": "base",
    "updateRule": "@request.auth.role = \"teacher\" || @request.auth.role = \"admin\"",
    "viewRule": "@request.auth.id != \"\""
  });

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2874626212");

  return app.delete(collection);
})
