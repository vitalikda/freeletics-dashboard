<template>
  <v-card
    ><v-card-title>
      <div>
        Top exercises
        <div class="subtitle-2 font-weight-regular text--secondary">
          Based on total repetitions
        </div>
      </div>
      <v-spacer></v-spacer>
      <v-select
        v-model="selectTop"
        :items="topOptions"
        item-text="name"
        item-value="value"
        class="text-body-2"
        style="max-width: 110px"
        flat
        solo
        dense
        hide-details
        @change="updateChart()"
      ></v-select>
    </v-card-title>

    <v-card-text>
      <apexchart
        height="297"
        type="donut"
        :options="chartOptions"
        :series="series"
      />
    </v-card-text>
  </v-card>
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
          type: 'donut',
          height: 297,
          background: 'transparent',
        },
        theme: {
          mode: this.theme,
          palette: 'palette10',
        },
        legend: {
          position: 'bottom',
        },
        stroke: {
          width: 0,
        },
        labels: [],
        responsive: [
          {
            breakpoint: 1264,
            options: {
              legend: {
                position: 'left',
              },
            },
          },
        ],
      },
      series: [],
      selectTop: 5,
      topOptions: [
        { name: 'Top 5', value: 5 },
        { name: 'Top 10', value: 10 },
        { name: 'Top 15', value: 15 },
      ],
    }
  },
  created() {
    ;[this.chartOptions.labels, this.series] = this.getChartData()
  },
  methods: {
    getChartData() {
      const items = this.rawData
      const output = this.selectTop
      const datasets = {}

      items.forEach((item) => {
        const name = item.name
        const r = item.reps

        if (!datasets[name]) datasets[name] = 0
        datasets[name] += r
      })

      const result = [[], []]
      Object.keys(datasets)
        .sort((a, b) => {
          return datasets[b] - datasets[a]
        })
        .forEach((key, index) => {
          if (index < output) {
            result[0].push(key)
            result[1].push(datasets[key])
          }
        })

      return result
    },
    updateChart() {
      this.chartOptions = { ...this.chartOptions }
      ;[this.chartOptions.labels, this.series] = this.getChartData()
    },
  },
}
</script>

<style>
.apexcharts-legend-text {
  text-transform: capitalize;
}
</style>
