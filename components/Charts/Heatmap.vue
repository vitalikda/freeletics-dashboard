<template>
  <apexchart
    height="250"
    type="heatmap"
    :options="chartOptions"
    :series="series"
  />
</template>

<script>
export default {
  props: {
    data: {
      type: Array,
      default() {
        return '[]'
      },
    },
    theme: {
      type: String,
      default: 'light',
    },
  },
  data() {
    return {
      rawData: this.data,
      chartOptions: {
        dataLabels: {
          enabled: false,
        },
        chart: {
          height: 250,
          toolbar: {
            show: false,
          },
          background: 'transparent',
        },
        theme: {
          mode: this.theme,
        },
        stroke: {
          width: 0.5,
        },
        plotOptions: {
          heatmap: {
            radius: 0,
            enableShades: false,
            colorScale: {
              ranges: [
                {
                  from: 0,
                  to: 5,
                  name: 'low',
                  color: '#A9D9EE',
                },
                {
                  from: 6,
                  to: 20,
                  name: 'medium',
                  color: '#66AEF4',
                },
                {
                  from: 21,
                  to: 45,
                  name: 'high',
                  color: '#5A91F3',
                },
                {
                  from: 46,
                  to: 1000,
                  name: 'extreme',
                  color: '#406AC8',
                },
              ],
            },
          },
        },
        legend: {
          position: 'bottom',
        },
        xaxis: {
          type: 'category',
          axisTicks: {
            show: false,
          },
        },
        tooltip: {
          theme: 'dark',
        },
      },
      series: [],
    }
  },
  created() {
    this.series = this.getChartData()
  },
  methods: {
    getChartData() {
      const items = this.rawData
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
      const datasets = {}

      items.forEach((item) => {
        const date = new Date(item.date)
        const day = date.getDay()
        const hour = date.getHours() // timezone on client side

        if (!datasets[day]) datasets[day] = Array(24).fill(0)
        datasets[day][hour]++
      })

      const result = []
      Object.keys(datasets).forEach((key) => {
        const name = days[key]
        const data = []
        for (let i = 0; i < 24; i++) {
          const x = ('0' + i).slice(-2) + ':00'
          const y = datasets[key][i]
          data.push({ x, y })
        }
        result.push({ name, data })
      })

      return result
    },
    updateChartOptions() {
      const mode = this.$vuetify.theme.dark ? 'dark' : 'light'

      this.chartOptions = {
        ...this.chartOptions,
        ...{
          theme: {
            mode,
          },
        },
      }
    },
  },
}
</script>
