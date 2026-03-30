/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = new Collection({
    "id": "pbc_comments_001",
    "name": "comments",
    "type": "base",
    "system": false,
    "listRule": "@request.auth.id != \"\"",
    "viewRule": "@request.auth.id != \"\"",
    "createRule": "@request.auth.id != \"\"",
    "updateRule": "@request.auth.id != \"\"",
    "deleteRule": "@request.auth.role = \"admin\"",
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
        "id": "text_content",
        "max": 2000,
        "min": 1,
        "name": "content",
        "pattern": "",
        "presentable": false,
        "primaryKey": false,
        "required": true,
        "system": false,
        "type": "text"
      },
      {
        "cascadeDelete": false,
        "collectionId": "_pb_users_auth_",
        "hidden": false,
        "id": "relation_author",
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
        "id": "select_target_type",
        "maxSelect": 1,
        "name": "target_type",
        "presentable": false,
        "required": true,
        "system": false,
        "type": "select",
        "values": [
          "announcement",
          "material"
        ]
      },
      {
        "autogeneratePattern": "",
        "hidden": false,
        "id": "text_target_id",
        "max": 15,
        "min": 15,
        "name": "target_id",
        "pattern": "^[a-z0-9]+$",
        "presentable": false,
        "primaryKey": false,
        "required": true,
        "system": false,
        "type": "text"
      },
      {
        "hidden": false,
        "id": "autodate2990389176",
        "name": "created",
        "onCreate": { "enabled": true },
        "onUpdate": { "enabled": false },
        "presentable": false,
        "system": false,
        "type": "autodate"
      },
      {
        "hidden": false,
        "id": "autodate3332085495",
        "name": "updated",
        "onCreate": { "enabled": true },
        "onUpdate": { "enabled": true },
        "presentable": false,
        "system": false,
        "type": "autodate"
      }
    ],
    "indexes": [
      "CREATE INDEX idx_comments_target ON comments (target_type, target_id)"
    ]
  });

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_comments_001");
  return app.delete(collection);
})
