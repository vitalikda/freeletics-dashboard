<template>
  <apexchart
    height="250"
    type="line"
    :options="chartOptions"
    :series="series"
  ></apexchart>
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
        chart: {
          type: 'line',
          height: 250,
          stacked: false,
          background: 'transparent',
          zoom: {
            enabled: false,
            autoScaleYaxis: true,
          },
          toolbar: {
            show: false,
          },
        },
        theme: {
          mode: this.theme,
        },
        stroke: {
          width: [0, 2, 5],
          curve: 'smooth',
        },
        plotOptions: {
          bar: {
            columnWidth: '50%',
          },
        },
        fill: {
          opacity: [0.85, 0.25, 1],
          gradient: {
            inverseColors: false,
            shade: 'light',
            type: 'vertical',
            opacityFrom: 0.85,
            opacityTo: 0.55,
            stops: [0, 100, 100, 100],
          },
        },
        labels: [],
        markers: {
          size: 0,
        },
        xaxis: {
          type: 'datetime',
          // tickAmount: 6,
        },
        yaxis: {
          min: 0,
        },
        tooltip: {
          theme: 'dark',
          shared: true,
          intersect: false,
          y: {
            formatter(y) {
              if (typeof y !== 'undefined') {
                return y.toFixed(0) + ' km'
              }
              return y
            },
          },
        },
      },
      series: [
        {
          name: 'Runs',
          type: 'column',
          data: [],
        },
        {
          name: 'Cumulative',
          type: 'area',
          data: [],
        },
      ],
    }
  },
  created() {
    ;[
      this.chartOptions.labels,
      this.series[0].data,
      this.series[1].data,
    ] = this.getChartData()
  },
  methods: {
    getChartData() {
      const items = this.rawData
      const datasets = {}
      const labels = []

      items
        .sort((a, b) => {
          return new Date(a.date) - new Date(b.date)
        })
        .forEach((item) => {
          const d = new Date(item.date)
          const m = Math.floor(item.meters)

          const year = d.getFullYear()
          const month = d.getMonth()

          const key = [year, month].join('-')
          if (m > 0) {
            if (!datasets[key]) {
              datasets[key] = 0
              labels.push(`${month + 1}/01/${year}`)
            }
            datasets[key] += m
          }
        })

      const result = []
      const comulative = []
      let sum = 0
      Object.keys(datasets).forEach((key) => {
        result.push(datasets[key])
        sum += datasets[key]
        comulative.push(sum)
      })

      return [labels, result, comulative]
    },
  },
}
</script>
