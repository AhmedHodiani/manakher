/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  // Remove relations from sections collection before deleting
  const sectionsCollection = app.findCollectionByNameOrId("pbc_1809324929");
  if (sectionsCollection) {
    // Remove the grade relation field
    const updatedFields = sectionsCollection.fields.filter(field => field.name !== "grade");
    sectionsCollection.fields = updatedFields;
    app.save(sectionsCollection);
  }
  
  // Remove section relation from student_enrollments collection
  const studentEnrollmentsCollection = app.findCollectionByNameOrId("pbc_1536027323");
  if (studentEnrollmentsCollection) {
    // Remove the section relation field
    const updatedFields = studentEnrollmentsCollection.fields.filter(field => field.name !== "section");
    studentEnrollmentsCollection.fields = updatedFields;
    app.save(studentEnrollmentsCollection);
  }
  
  // Remove section relation from teacher_assignments collection
  const teacherAssignmentsCollection = app.findCollectionByNameOrId("pbc_2791557661");
  if (teacherAssignmentsCollection) {
    // Remove the section relation field
    const updatedFields = teacherAssignmentsCollection.fields.filter(field => field.name !== "section");
    teacherAssignmentsCollection.fields = updatedFields;
    app.save(teacherAssignmentsCollection);
  }
  
  // Now delete the sections collection if it exists
  const sectionsCollectionToDelete = app.findCollectionByNameOrId("pbc_1809324929");
  if (sectionsCollectionToDelete) {
    return app.delete(sectionsCollectionToDelete);
  }
  
  return Promise.resolve();
}, (app) => {
  // For down migration, just recreate a basic sections collection
  // The relations will be handled by subsequent migrations
  const collection = new Collection({
    "createRule": "@request.auth.role = \"admin\"",
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
      },
      {
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
      }
    ],
    "id": "pbc_1809324929",
    "indexes": [],
    "listRule": "@request.auth.id != \"\"",
    "name": "sections",
    "system": false,
    "type": "base",
    "updateRule": "@request.auth.role = \"admin\"",
    "viewRule": "@request.auth.id != \"\""
  });

  return app.save(collection);
})
