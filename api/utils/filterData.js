const filterData = (json) => {
  let exercises = json.training.trainings
  let user = json.user.data

  // Filter exercises
  exercises = exercises.map((item) => {
    // workouts with these name are undefined - no data could be extraced
    const dontTouch = ['con', 'end', 'pre', 'rec', 'str', 'weight', 'free']
    // clear out: these are system words and do not have any meaning
    const removeText = [
      'none',
      'moderate',
      'strength',
      'comfortable',
      'endurance',
      'standard',
      'technical',
      'toolbox',
      'right',
      'left',
    ]

    const w = item.workout.toLowerCase()

    // Single exercise defaults
    const date = item.performed_at
    let name = w
    let reps = 1
    let star = 0
    let time = 0
    let meters = 0

    // filter out workouts in Dont Touch list
    const firstWord = w.split(' ')[0]
    if (!dontTouch.includes(firstWord)) {
      // split workout into Name and Repetitions/Meters
      const index = w.search(/\d/)
      if (index !== -1) {
        name = w.substring(0, index - 1)
        if (name.includes('distance')) {
          // if it's a 'Distance Run'
          meters = Number(w.substring(index))
          reps = Number(w.substring(index)) / 100
        } else {
          reps = Number(w.substring(index))
        }
      }
      // remove system clutter & double spaces in the string
      const re = new RegExp(removeText.join('|'), 'gi')
      name = name.replace(re, '').replace(/\s+/g, ' ').trim()
    }

    // set Star
    if (item.star) star = 1
    if (item.personal_best) star = 2

    // convert Time to seconds
    if (item.time) {
      time = item.time.split(':').reduce((total, value, index) => {
        return total + value * [3600, 60, 1][index]
      }, 0)
    }

    return {
      date,
      name,
      reps,
      star,
      time,
      meters,
    }
  })

  // Filter user
  user = {
    id: user[':id'],
    firstName: user[':first_name'],
    lastName: user[':last_name'],
  }

  return { exercises, user }
}

module.exports = filterData
