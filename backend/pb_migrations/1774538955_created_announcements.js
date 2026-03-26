/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = new Collection({
    "createRule": "@request.auth.id != \"\" && (@request.auth.role = \"teacher\" || @request.auth.role = \"admin\")",
    "deleteRule": "@request.auth.id = author.id || @request.auth.role = \"admin\"",
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
        "autogeneratePattern": "",
        "hidden": false,
        "id": "text724990059",
        "max": 0,
        "min": 0,
        "name": "title",
        "pattern": "",
        "presentable": false,
        "primaryKey": false,
        "required": true,
        "system": false,
        "type": "text"
      },
      {
        "convertURLs": false,
        "hidden": false,
        "id": "editor3685223346",
        "maxSize": 0,
        "name": "body",
        "presentable": false,
        "required": true,
        "system": false,
        "type": "editor"
      },
      {
        "cascadeDelete": false,
        "collectionId": "_pb_users_auth_",
        "hidden": false,
        "id": "relation3182418120",
        "maxSelect": 1,
        "minSelect": 0,
        "name": "author",
        "presentable": false,
        "required": true,
        "system": false,
        "type": "relation"
      },
      {
        "hidden": false,
        "id": "select11490771",
        "maxSelect": 0,
        "name": "scope",
        "presentable": false,
        "required": true,
        "system": false,
        "type": "select",
        "values": [
          "global",
          "section"
        ]
      },
      {
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
      }
    ],
    "id": "pbc_3866499052",
    "indexes": [],
    "listRule": "@request.auth.id != \"\"",
    "name": "announcements",
    "system": false,
    "type": "base",
    "updateRule": "@request.auth.id = author.id",
    "viewRule": "@request.auth.id != \"\""
  });

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3866499052");

  return app.delete(collection);
})
