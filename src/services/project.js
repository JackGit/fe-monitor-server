const Database = require('../db')
const utils = require('../utils/service')
const corsUtils = require('../utils/cors')

exports.create = async function ({ name, url, desc }) {
  const now = new Date()
  const projectCollection = Database.collection('Project')
  const projectDocument = { name, url, desc, createdAt: now, updatedAt: now, deleted: false }
  return projectCollection.insertOne(projectDocument).then(() =>{
    corsUtils.addDomain(url)
    return projectDocument
  })
}

exports.remove = async function (id) {
  const projectCollection = Database.collection('Project')
  return projectCollection.findOneAndUpdate(
    { _id: Database.utils.ObjectId(id) },
    { $set: { deleted: true }}
  ).then(response => {
    corsUtils.removeDomain(response.value.url)
    return { _id: id, name: response.value.name, value: response.value.url }
  })
}

exports.getList = async function ({ sort, ascending }) {
  const projectCollection = Database.collection('Project')
  return projectCollection.find({ deleted: false }).sort(sort ? { [sort]: ascending ? -1 : 1 } : null).toArray()
}

exports.cacheDomains = function () {
  const projectCollection = Database.collection('Project')
  projectCollection.find({ deleted: false }).project({ url: 1 }).toArray(function (err, response) {
    response.forEach(project => corsUtils.addDomain(project.url))
  })
}
