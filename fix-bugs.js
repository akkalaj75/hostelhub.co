{
  "indexes": [
    {
      "collectionGroup": "waiting",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "hostel", "order": "ASCENDING" },
        { "fieldPath": "interests", "arrayConfig": "CONTAINS" },
        { "fieldPath": "timestamp", "order": "DESCENDING" }
      ]
    }
  ]
}
