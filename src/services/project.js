const Database = require('../db')
const utils = require('../utils/service')

exports.create = async function ({ name, url, desc }) {
  const now = new Date()
  const projectCollection = Database.collection('Project')
  const projectDocument = { name, url, desc, createdAt: now, updatedAt: now, deleted: false }
  return projectCollection.insertOne(projectDocument).then(() => projectDocument)
}

exports.remove = async function (id) {
  const projectCollection = Database.collection('Project')
  return projectCollection.updateOne(
    { _id: Database.utils.ObjectId(id) },
    { $set: { deleted: true }}
  )
}

exports.getList = async function ({ sort, ascending }) {
  const projectCollection = Database.collection('Project')
  return projectCollection.find({ deleted: false }).sort(sort ? { [sort]: ascending ? -1 : 1 } : null).toArray()
}
