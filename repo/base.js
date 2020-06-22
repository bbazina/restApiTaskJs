// TREAT THIS AS A BLACKBOX
// conditions and data are sent as an object with column names as key, values being values
// any - returns any or no rows with specified conditions
// one - returns one row with specified conditions, throws if there's more than one
// none - throws if there are rows with specified conditions
// insert - inserts a new row
// update - updates any number of rows with specified conditions
// updateOne - updates one row with specified conditions, throws if there's more than one

const _ = require('lodash')
const _fp = require('lodash/fp')

const db = require('../db')

function any (table) {
  return function (conditions) {
    let sql = `
      SELECT *
      FROM ??
    `
    if (!_.isEmpty(conditions)) {
      sql += ` WHERE ?`
    }

    return db.query(sql, [table, conditions])
  }
}

function one (table) {
  return function (conditions) {
    return db.query(`
      SELECT *
      FROM ??
      WHERE ?
    `, [table, conditions])
    .then(function (rows) {
      if (_.size(rows) !== 1) {
        throw new Error('expected one')
      }
      return _.head(rows)
    })
  }
}

function none (table) {
  return function (conditions) {
    return db.query(`
      SELECT *
      FROM ??
      WHERE ?
    `, [table, conditions])
    .then(function (rows) {
      if (_.size(rows) !== 0) {
        throw new Error('expected none')
      }
      return null
    })
  }
}

function insert (table) {
  return function (data) {
    return db.query(`
      INSERT INTO ??
      SET ?
    `, [table, data])
    .get('insertId')
  }
}

function update (table) {
  return function (conditions, data) {
    return db.query(`
      UPDATE ??
      SET ?
      WHERE ?
    `, [table, data, conditions])
    .get('affectedRows')
  }
}

function updateOne (table) {
  return function (conditions, data) {
    return one(table)(conditions)
    .then(function () {
      return db.query(`
        UPDATE ??
        SET ?
        WHERE ?
        LIMIT 1
      `, [table, data, conditions])
    })
    .get('affectedRows')
  }
}

function deleteOne (table) {
  return function (conditions, data) {
    return db.query(`
      DELETE FROM ??
      WHERE ?
      `, [table, conditions])

    .get('affectedRows')
  }
}

module.exports = function (table) {
  return {
    any: any(table),
    one: one(table),
    none: none(table),
    insert: insert(table),
    update: update(table),
    updateOne: updateOne(table),
    deleteOne: deleteOne(table),
    omit: _fp.omit,
  }
}
