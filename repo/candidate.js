const db = require('../db')
const _ = require('lodash')
const {insert, deleteOne} = require('./base')('candidate')

function create (firstName, lastName, testDate) {
  const values = _.omitBy({first_name: firstName,
    last_name: lastName,
    test_date: testDate }, _.isNil)
  return insert(values)
  .catchThrow(new Error('error storing candidate'))
}

function deleteUserById (id) {
  if (!id) {
    throw Error('no id')
  }
  return deleteOne({id})
}

function createWithRawSQL (firstName, lastName, testDate) {
  const values = _.omitBy({first_name: firstName,
    last_name: lastName,
    test_date: testDate }, _.isNil)
  return db.query(`INSERT INTO candidate SET ?`, [values])
}

module.exports = {
  create,
  createWithRawSQL,
  deleteUserById,
}
