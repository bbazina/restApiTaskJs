const joi = require('joi')
const jwt = require('jsonwebtoken')
const router = require('express').Router()

const helper = require('../middleware/helper')
const userRepo = require('../repo/user')
const validate = require('../middleware/validate')

router.use(helper.api)

router.post('/auth', validate('body', joi.object().keys({
  email: joi.string().email().required(),
  password: joi.string().required(),
})), function (req, res) {
  const {email, password} = req.vbody

  userRepo.getByEmailPassword(email, password)
  .then(function (user) {
    return jwt.sign({id: user.id}, process.env.JWT_SECRET)
  })
  .then(res.apiSuccess)
  .catch(res.apiFail)
})

router.post('/register', validate('body', joi.object().keys({
  email: joi.string().email().required(),
  password: joi.string().min(8).required(),
  firstName: joi.string().trim().optional(),
  lastName: joi.string().trim().optional(),
  bio: joi.string().trim().optional(),
})), function (req, res) {
  const {email, password, firstName, lastName, bio} = req.vbody

  userRepo.create(email, password, firstName, lastName, bio)
  .then(res.apiSuccess)
  .catch(res.apiFail)
})

module.exports = router
