/* eslint-disable no-console */
const router = require('express').Router()
const multer = require('multer')

const { convertYamlToJson, resetJson } = require('../utils')

// Multer config
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'api/data/')
  },
  filename(req, file, cb) {
    cb(null, 'main.json')
  },
})
const upload = multer({ storage }).single('file')

// @desc    Upload YAML file with exercises
// @route   POST /api/file/upload
router.post('/upload', function (req, res) {
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred when uploading.
      console.log('There was an error uploading the file: ', err)
    } else if (err) {
      // An unknown error occurred when uploading.
      console.log('Something wennt wrong when uploading the file: ', err)
    }

    // req.body contains the text fields
    // console.log(req.file);
    // res.json(file.body);
    convertYamlToJson(req.file.path)

    res.status(200).send({ message: 'File uploaded' })
  })
})

// @desc    Set main.json = {}
// @route   POST /api/file/delete
router.post('/delete', function (req, res) {
  try {
    resetJson()
    res.status(200).send({ message: 'File deleted' })
  } catch (err) {
    res.status(500).send({ message: "Error: Couldn't delete file:" + err })
  }
})

module.exports = router
