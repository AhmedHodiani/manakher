/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2151097168")

  // update collection data
  unmarshal({
    "updateRule": "@request.auth.id = student || @request.auth.role = \"teacher\" || @request.auth.role = \"admin\""
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2151097168")

  // update collection data
  unmarshal({
    "updateRule": "@request.auth.id = student"
  }, collection)

  return app.save(collection)
})
