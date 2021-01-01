export const actions = {
  async getUser(demo) {
    demo = demo ? '?demo=true' : ''
    const res = await this.$axios.get('/api/user' + demo)
    return res.data
  },
  async getExercises(demo) {
    demo = demo ? '?demo=true' : ''
    const res = await this.$axios.get('/api/exercises' + demo)
    return res.data
  },
  async getStats(demo) {
    demo = demo ? '?demo=true&' : '?'
    const totalExercises = await this.$axios.get(
      '/api/exercises' + demo + 'count=name'
    )
    const secondsTrained = await this.$axios.get(
      '/api/exercises' + demo + 'sum=time'
    )
    const totalStars = await this.$axios.get(
      '/api/exercises' + demo + 'sum=star'
    )
    const totalMeters = await this.$axios.get(
      '/api/exercises' + demo + 'sum=meters'
    )
    return {
      totalExercises: totalExercises.data.count,
      secondsTrained: secondsTrained.data.sum,
      totalStars: totalStars.data.sum,
      totalMeters: totalMeters.data.sum,
    }
  },
}
