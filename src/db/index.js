const mongo = require('mongodb')
const MongoClient = mongo.MongoClient

function Database () {}

Database.connect = function (url, callback) {
  // connect mongodb
  MongoClient.connect(url, (err, db) => {
    if (err) {
      throw err
    }

    Database.instance = db
    callback && callback()
  })
}

Database.getInstance = function () {
  return Database.instance
}

Database.collection = function (name) {
  return Database.instance.collection(name)
}

Database.utils = {
  ObjectId (id) {
    return new mongo.ObjectID(id)
  }
}

module.exports = Database
