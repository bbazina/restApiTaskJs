const mysql = require('promise-mysql')

const db = mysql.createPool(`${process.env.DATABASE_URL}?connectionLimit=8&timezone=UTC`)

module.exports = db
