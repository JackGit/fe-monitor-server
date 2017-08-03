const Database = require('../db')
const utils = require('../utils/service')

exports.create = async function ({ name, url, desc }) {
  const now = new Date()
  const projectCollection = Database.collection('Project')
  const projectDocument = { name, url, desc, createdAt: now, updatedAt: now }
  return projectCollection.insertOne(projectDocument).then(() => projectDocument)
}

exports.get = async function () {

}

exports.getList = async function ({ sort, ascending }) {
  const projectCollection = Database.collection('Project')
  return projectCollection.find().sort(sort ? { [sort]: ascending ? -1 : 1 } : null).toArray()
}
