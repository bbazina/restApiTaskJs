function validate (field, schema, abortEarly = false) {
  return function (req, res, next) {
    req.schema = schema.describe()
    schema.validate(req[field], {abortEarly}, function (err, data) {
      if (err && err.isJoi) {
        return res.status(400).json({
          message: 'invalid request',
          error: err.details,
          code: 400,
        })
      }

      req[`v${field}`] = data
      if (err) {
        return next(err)
      }
      next()
    })
  }
}

module.exports = validate
