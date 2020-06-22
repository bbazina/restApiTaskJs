const joi = require('joi')
const router = require('express').Router()

const helper = require('../middleware/helper')
const authenticate = require('../middleware/authenticate')
const userRepo = require('../repo/user')
const candidateRepo = require('../repo/candidate')
const validate = require('../middleware/validate')

router.use(helper.api)
router.use(authenticate.checkToken)

//  TASK 1.
// PUT route /user/:id for updating the user by its id
// - accepts firstName, lastName, bio
// - bonus: validate url params using joiPUT
// - bonus: return the user in the response after updating
// - bonus: write an SQL query instead of using the provided helper functions (leave both solutions in the code)

// note - for last bonus -> created two functions with SQL in userRepo: updateUserWithRawSQL and getUserByIdWithRawSQL.

router.put(
  '/user/:id',
  validate(
    'body',
    joi.object().keys({
      firstName: joi.string().trim().optional(),
      lastName: joi.string().trim().optional(),
      bio: joi.string().trim().optional(),
    })
  ),
  validate(
    'params',
    joi.object().keys({
      id: joi.string().trim().required(),
    })
  ),
  async (req, res) => {
    const { firstName, lastName, bio } = req.vbody
    const { id } = req.vparams

    try {
      const affectedRows = await userRepo.updateUser(
        id,
        firstName,
        lastName,
        bio
      )
      // const affectedRows = await userRepo.updateUserWithRawSQL(id, firstName, lastName, bio) // for Raw SQL use uncomment this line and comment out above line
      console.log({ affectedRows })
      if (!Number(affectedRows)) {
        throw Error('User is not updated!')
      }
      const user = await userRepo.getUserById(id)
      // const user = await userRepo.getUserByIdWithRawSQL(id)  // for Raw SQL use uncomment this line and comment out above line
      return res.apiSuccess(user)
    } catch (error) {
      return res.apiFail(error)
    }
  }
)

//  TASK 2.
// GET route /user/:id for getting the user by its id
// - bonus: validate url params using joi
// - bonus: write an SQL query instead of using the provided helper functions (leave both solutions in the code)

// note - for last bonus -> created function with SQL in userRepo: getUserByIdWithRawSQL.

router.get(
  '/user/:id',
  validate(
    'params',
    joi.object().keys({
      id: joi.string().trim().required(),
    })
  ),
  async (req, res) => {
    const { id } = req.vparams
    try {
      const user = await userRepo.getUserById(id)
      // const user = await userRepo.getUserByIdWithRawSQL(id) // for Raw SQL use uncomment this line and comment out above line
      return res.apiSuccess(user)
    } catch (error) {
      return res.apiFail(error)
    }
  }
)

// BONUS TASK 3.
// after creating migration
// - POST route /candidate for recording a new candidate in the table specified above

// note - for last bonus -> created function with SQL in candidateRepo: createWithRawSQL.

router.post('/candidate', validate('body', joi.object().keys({
  firstName: joi.string().required(),
  lastName: joi.string().required(),
  testDate: joi.string().optional(),
})), async (req, res) => {
  const {firstName, lastName, testDate} = req.vbody
  try {
    const candidate = await candidateRepo.create(firstName, lastName, testDate)
    // const candidate = await candidateRepo.createWithRawSQL(firstName, lastName, testDate)
    return res.apiSuccess(candidate)
  } catch (error) {
    return res.apiFail(error)
  }
})

router.delete('/candidate/:jure', validate('params', joi.object().keys({
  jure: joi.string().trim().required(),
})), async (req, res) => {
  const {jure} = req.vparams
  console.log(jure)
  try {
    const affectedRows = await candidateRepo.deleteUserById(jure)
    console.log(jure)
    if (!Number(affectedRows)) {
      throw Error('User is not updated!')
    }
    return res.apiSuccess({id: jure})
  } catch (error) {
    return res.apiFail(error)
  }
})

// 5. BONUS TASK
// - create routes like in 1. and 2. but without /:id
// - they should apply to the authenticated user by using the user id from the decoded JWT
// ------------------------------------------------
router.put(
  '/user',
  validate(
    'body',
    joi.object().keys({
      firstName: joi.string().trim().optional(),
      lastName: joi.string().trim().optional(),
      bio: joi.string().trim().optional(),
    })
  ),
  async (req, res) => {
    const { firstName, lastName, bio } = req.vbody
    const { id } = req.decoded

    try {
      const affectedRows = await userRepo.updateUser(
        id,
        firstName,
        lastName,
        bio
      )
      // const affectedRows = await userRepo.updateUserWithRawSQL(id, firstName, lastName, bio) // for Raw SQL use uncomment this line and comment out above line
      if (!Number(affectedRows)) {
        throw Error('User is not updated!')
      }
      // const user = await userRepo.getUserById(id)
      const user = await userRepo.getUserByIdWithRawSQL(id) // for Raw SQL use uncomment this line and comment out above line
      return res.apiSuccess(user)
    } catch (error) {
      return res.apiFail(error)
    }
  }
)
router.get('/user', async (req, res) => {
  const { id } = req.decoded
  try {
    const user = await userRepo.getUserById(id)
    // const user = await userRepo.getUserByIdWithRawSQL(id)  // for Raw SQL use uncomment this line and comment out above line
    return res.apiSuccess(user)
  } catch (error) {
    return res.apiFail(error)
  }
})

// ------------------------------------------------
module.exports = router
