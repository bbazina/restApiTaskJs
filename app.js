const app = require('express')()
const bodyParser = require('body-parser')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded())

app.use('/', require('./routes/index'))

module.exports = app
