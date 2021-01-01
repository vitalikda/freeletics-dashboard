// util to calculate total trained hours
function calculateTrainedHours(workouts) {
  return secondsToHours(
    workouts
      .filter((item) => !!item.time)
      .reduce((total, item) => {
        return total + timeStringToSeconds(item.time)
      }, 0)
  )
}

// convert time string "00:10:00" to seconds
function timeStringToSeconds(timeString) {
  return timeString.split(':').reduce((total, value, index) => {
    return total + value * [3600, 60, 1][index]
  }, 0)
}

// convert seconds to hours
function secondsToHours(seconds) {
  return Math.floor(seconds / 3600)
}

// util to calculate data for Line chart
function getWorkoutsDataForLineChart(workouts) {
  // dataset with number of workouts per month in a year, ex { 2019: [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 13, 21, 27 ] }
  const d = {}
  workouts.forEach((w) => {
    const date = new Date(w.performed_at)
    const [year, month] = [date.getFullYear(), date.getMonth()]

    if (!d[year]) {
      // generate new array of zeros, ex [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ]
      d[year] = Array(12).fill(0)
    }
    // get array of zeros then increment by 1 in place of current month
    d[year][month]++
  })

  // prepare data for Line Chart
  const datasets = []
  Object.keys(d).forEach((key) => {
    datasets.push({
      label: key,
      data: d[key],
      backgroundColor: randomRgba(),
    })
  })

  return datasets
}

// generate random rgba
function randomRgba() {
  const o = Math.round
  const r = Math.random
  const s = 255
  return `rgba(${o(r() * s)},${o(r() * s)},${o(r() * s)},${r().toFixed(2)})`
}

// util to calculate data for Doughnut chart
function getWorkoutsDataForDoughnutChart(workouts, outputLength) {
  const d = {}
  workouts.forEach((w) => {
    const name = w.workout
    if (!d[name]) {
      d[name] = 0
    }
    d[name]++
  })

  const chartData = {
    labels: [],
    datasets: [{ data: [], backgroundColor: [], borderWidth: 0 }],
  }
  Object.keys(d)
    .sort((a, b) => {
      return d[b] - d[a]
    })
    .forEach((key, index) => {
      if (index < outputLength) {
        chartData.labels.push(key)
        chartData.datasets[0].data.push(d[key])
        chartData.datasets[0].backgroundColor.push(randomRgba())
      }
    })

  return chartData
}

export {
  calculateTrainedHours,
  getWorkoutsDataForLineChart,
  getWorkoutsDataForDoughnutChart,
}
