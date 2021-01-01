const router = require('express').Router()

const { searchByKey, sumByKey, countByKey, rangeByKey } = require('../utils')

const data = require('../data/main.json')
const demo = require('../data/demo.json')

// @desc    Gets all exercises
// @route   GET /api/exercises
router.get('/', (req, res) => {
  // @desc    Select between main and demo data
  // @route   GET /api/exercises?demo=true
  let exercises = req.query.demo ? demo.exercises : data.exercises

  // @desc    Get seach results: search = key, q = value
  // @route   GET /api/exercises?search=name&q=pullup
  if (req.query.search)
    exercises = searchByKey(req.query.search, req.query.q, exercises)
  // @desc    Get results by range: range = key, from = start_value, to = end_value
  // @route   GET /api/exercises?range=date&from=DATE&to=DATE
  if (req.query.range)
    exercises = rangeByKey(
      req.query.range,
      req.query.from,
      req.query.to,
      exercises
    )
  // @desc    Get sum: sum = key
  // @route   GET /api/exercises?sum=reps
  if (req.query.sum) exercises = { sum: sumByKey(req.query.sum, exercises) }
  // @desc    Get count: count = key
  // @route   GET /api/exercises?count=star
  if (req.query.count)
    exercises = { count: countByKey(req.query.count, exercises) }

  res.json(exercises)
})

module.exports = router
