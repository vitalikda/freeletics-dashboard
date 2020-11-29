// util to calculate total trained hours
function calculateTrainedHours(workouts) {
  return secondsToHours(
    workouts
      .filter(item => !!item.time)
      .reduce((total, item) => {
        return total + timeStringToSeconds(item.time);
      }, 0)
  );
}

// convert time string "00:10:00" to seconds
function timeStringToSeconds(timeString) {
  return timeString.split(":").reduce((total, value, index) => {
    return total + value * [3600, 60, 1][index];
  }, 0);
}

// convert seconds to hours
function secondsToHours(seconds) {
  return Math.floor(seconds / 3600);
}

// util to calculate data for Line chart
function getWorkoutsDataForLineChart(workouts) {
  const m = workouts.map(w => {
    let date = new Date(w.performed_at);
    return `${date.getFullYear()}-${date.getMonth()}`;
  });

  // dataset with number of workouts per month in a year, ex { 2019: [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 13, 21, 27 ] }
  const d = {};
  m.forEach(value => {
    let [year, month] = value.split("-");

    d[year] = d[year]
      ? // get array of zeros then add +1 in place of current month
        (d[year] = d[year].map((x, i) => (x = i == month ? x + 1 : x)))
      : // generate new array of zeros then add 1 in place of current month, ex [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0 ]
        Array.from({ length: 12 }, (x, i) => (x = i == month ? 1 : 0));
  });

  // prepare data for Line Chart
  const datasets = [];
  Object.keys(d).forEach(key => {
    datasets.push({
      label: key,
      data: d[key],
      backgroundColor: "#" + Math.floor(Math.random() * 16777215).toString(16)
    });
  });

  return datasets;
}

export { calculateTrainedHours, getWorkoutsDataForLineChart };
