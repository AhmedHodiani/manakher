/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = new Collection({
    "createRule": "@request.auth.id != \"\" && @request.auth.role = \"teacher\"",
    "deleteRule": "@request.auth.id = teacher.id || @request.auth.role = \"admin\"",
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
        "required": false,
        "system": false,
        "type": "editor"
      },
      {
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
      },
      {
        "exceptDomains": null,
        "hidden": false,
        "id": "url3087911061",
        "name": "link_url",
        "onlyDomains": null,
        "presentable": false,
        "required": false,
        "system": false,
        "type": "url"
      },
      {
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
        "required": true,
        "system": false,
        "type": "relation"
      },
      {
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
      }
    ],
    "id": "pbc_4282183725",
    "indexes": [],
    "listRule": "@request.auth.id != \"\"",
    "name": "materials",
    "system": false,
    "type": "base",
    "updateRule": "@request.auth.id = teacher.id",
    "viewRule": "@request.auth.id != \"\""
  });

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_4282183725");

  return app.delete(collection);
})
