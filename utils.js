// convert time string "00:10:00" to seconds
function timestrToSec(timestr) {
  var parts = timestr.split(":");
  return parts[0] * 3600 + parts[1] * 60 + +parts[2];
}
// convert seconds to hours
function secToHrs(seconds) {
  return Math.floor(seconds / 3600) % 60;
}
// util to calculate data for Line chart
function calcWorkouts(workouts) {
  const datasets = [];
  var currentYear = null;
  var workoutsPerMonth = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

  workouts.map((item, index) => {
    let currentDate = new Date(item.performed_at);
    let year = currentDate.getFullYear();
    let month = currentDate.getMonth();

    if (!currentYear) {
      currentYear = year;
    }
    if (currentYear === year && index != workouts.length - 1) {
      workoutsPerMonth = workoutsPerMonth.map((value, index) => {
        return index === month ? ++value : value;
      });
    } else {
      datasets.push({
        label: currentYear,
        data: workoutsPerMonth,
        backgroundColor: "#" + Math.floor(Math.random() * 16777215).toString(16)
      });
      currentYear = year;
      workoutsPerMonth = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    }
  });
  return datasets;
}

export { timestrToSec, secToHrs, calcWorkouts };
