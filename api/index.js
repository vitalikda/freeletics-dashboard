const express = require('express')
const cors = require('cors')

// Require API Routes
const fileRouter = require('./routes/file')
const exercisesRouter = require('./routes/exercises')
const userRouter = require('./routes/user')

// Create express instance
const app = express()

// Middleware
app
  .use(cors())
  .use(express.json())
  .use(express.urlencoded({ extended: false }))

// Import API Routes
app
  .use('/file', fileRouter)
  .use('/exercises', exercisesRouter)
  .use('/user', userRouter)

// Error Handler
app.use(function (err, req, res, next) {
  // Show error only in dev mode
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  res.status(err.status || 500)
  res.render('error')
})

// Export express app
module.exports = app

if (require.main === module) {
  const PORT = process.env.PORT || 8080
  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`API server listening on port ${PORT}`)
  })
}
