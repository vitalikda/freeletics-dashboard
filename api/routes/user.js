const router = require('express').Router()

const data = require('../data/main.json')
const demo = require('../data/demo.json')

// @desc    Gets User data
// @route   GET /api/user
router.get('/', (req, res) => {
  // @desc    Select between main and demo data
  // @route   GET /api/user?demo=true
  const user = req.query.demo ? demo.user : data.user

  res.json(user)
})

module.exports = router
