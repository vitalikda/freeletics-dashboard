/* eslint-disable no-console */
const fs = require('fs')
const yaml = require('js-yaml')

const filterData = require('./filterData')

const convertYamlToJson = (file) => {
  try {
    const json = yaml.safeLoad(fs.readFileSync(file, 'utf8'))
    const filteredJson = filterData(json)

    // Re-write uploaded .yaml file with filtered JSON data
    fs.writeFileSync(file, JSON.stringify(filteredJson), 'utf8', (err) => {
      if (err) {
        console.log("Coundn't save JSON file:", err)
      }
    })

    return file
  } catch (err) {
    console.log('Something went wrong when converting YAML to JSON:', err)
    resetJson()
  }
}

const resetJson = () => {
  try {
    fs.writeFileSync('api/data/main.json', '{}', 'utf8', (err) => {
      if (err) console.log("Coundn't delete JSON file:", err)
      console.log('Data has been deleted')
    })
  } catch (err) {
    console.log("Coundn't find JSON file:", err)
  }
}

const rangeByKey = (key, from, to, array) => {
  return array.filter((item) => item[key] >= from && item[key] <= to)
}

const searchByKey = (key, query, array) => {
  return array.filter((item) => String(item[key]).includes(query))
}

const sumByKey = (key, array) => {
  const result = array.reduce((total, item) => {
    return total + item[key]
  }, 0)
  return result
}

const countByKey = (key, array) => {
  return array.filter((item) => item[key] !== '').length
}

module.exports = {
  convertYamlToJson,
  resetJson,
  rangeByKey,
  searchByKey,
  sumByKey,
  countByKey,
}
