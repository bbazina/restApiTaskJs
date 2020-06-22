const assert = require('assert')
const bcrypt = require('bcrypt')
const Promise = require('bluebird')
const _ = require('lodash')
const db = require('../db')
const {one, none, insert, update, omit} = require('./base')('user')

function create (email, password, firstName, lastName, bio) {
  return Promise.resolve(bcrypt.hash(password, parseInt(process.env.BCRYPT_ROUNDS)))
  .catchThrow(new Error('invalid password'))
  .then(function (hash) {
    return insert({
      email: email,
      password: hash,
      first_name: firstName,
      last_name: lastName,
      bio: bio,
    })
  })
  .catchThrow(new Error('error storing user'))
}

function getByEmailPassword (email, password) {
  return one({email})
  .catchThrow(new Error('invalid username/password combination'))
  .tap(function (user) {
    return bcrypt.compare(password, user.password)
    .then(assert)
  })
  .catchThrow(new Error('invalid username/password combination'))
  .then(omit('password'))
}

function getUserById (id) {
  return one({id}).then(omit('password'))
  .catchThrow(new Error('invalid user id'))
}

function updateUser (id, firstName, lastName, bio) {
  // NOTE:
  // omitBy with isNill will remove all undefined or null properties from object
  // example: {a: null, b: undefined c:'test'} => {c: 'test'}
  const values = _.omitBy({first_name: firstName, last_name: lastName, bio: bio}, _.isNil)
  if (_.isEmpty(values)) {
    throw Error('Must provide at least one field for update')
  }
  return update({id}, values)
}

function updateUserWithRawSQL (id, firstName, lastName, bio) {
  const values = _.omitBy({first_name: firstName, last_name: lastName, bio: bio}, _.isNil)
  if (_.isEmpty(values)) {
    throw Error('Must provide at least one field for update')
  }
  return db.query(`UPDATE user SET ? WHERE ?`, [values, {id}]).get('affectedRows')
}

function getUserByIdWithRawSQL (id) {
  return db.query(`SELECT * FROM user WHERE ?;`, [{id}]).then((data) => {
    const row = _.head(data)
    return omit('password')(row)
  })
}

function ensureEmailNotTaken (email) {
  return none({email})
  .catchThrow(new Error('email taken'))
}

module.exports = {
  create,
  updateUserWithRawSQL,
  getUserByIdWithRawSQL,
  updateUser,
  getUserById,
  getByEmailPassword,
  ensureEmailNotTaken,
}
