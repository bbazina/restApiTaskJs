function api (req, res, next) {
  res.apiSuccess = function (data) {
    res.json({
      code: 200,
      data,
    })
  }

  res.apiFail = function (err) {
    res.error(500, err.message)
  }

  res.error = function (code, error) {
    res.status(code).json({
      code,
      error,
    })
  }

  next()
}

module.exports = {
  api,
}
