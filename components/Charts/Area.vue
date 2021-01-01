<template>
  <v-card>
    <v-card-title>
      <div>
        Training growth
        <div class="subtitle-2 font-weight-regular text--secondary">
          Number of workouts per month
        </div>
      </div>
      <v-spacer></v-spacer>
      <v-btn-toggle
        v-model="selectType"
        class="my-2 mr-2"
        mandatory
        @change="updateChart()"
      >
        <v-btn :value="0" class="px-4" plain small>Exercises</v-btn>
        <v-btn :value="1" class="px-4" plain small>Time</v-btn>
        <v-btn :value="2" class="px-4" plain small>Reps</v-btn>
      </v-btn-toggle>
      <v-select
        v-model="selectRecurrence"
        :items="recurrences"
        class="text-body-2"
        style="max-width: 140px"
        flat
        solo
        dense
        hide-details
        prepend-inner-icon="mdi-clock-outline"
        @change="updateChart()"
      ></v-select>
    </v-card-title>

    <v-card-text>
      <apexchart
        type="area"
        height="250"
        :options="chartOptions"
        :series="series"
      ></apexchart>
    </v-card-text>
  </v-card>
</template>

<script>
import dayjs from 'dayjs'
import weekOfYear from 'dayjs/plugin/weekOfYear'
dayjs.extend(weekOfYear)

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
          type: 'area',
          height: 250,
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
        dataLabels: {
          enabled: false,
        },
        stroke: {
          curve: 'smooth',
        },
        xaxis: {
          type: 'datetime',
          tickAmount: 6,
        },
        tooltip: {
          x: {
            format: 'dd MMM yyyy',
          },
          theme: 'dark',
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
        noData: {
          text: 'Loading...',
        },
      },
      series: [],
      selectType: 0,
      seriesNames: ['Exercises', 'Time (min)', 'Reps'],
      selectRecurrence: 'Monthly',
      recurrences: ['Daily', 'Weekly', 'Monthly', 'Yearly'],
    }
  },
  created() {
    this.series = this.getChartData()
  },
  methods: {
    getChartData() {
      const items = this.rawData
      const recIndex = this.recurrences.indexOf(this.selectRecurrence)
      const dataType = this.selectType
      const datasets = {}

      items.forEach((item) => {
        const d = new Date(item.date)
        const t = Math.floor(item.time / 60)
        const r = item.reps
        const year = recIndex <= 3 ? d.getFullYear() : ''
        const month = recIndex <= 2 ? d.getMonth() : ''
        const week = recIndex <= 1 ? dayjs(d).week() : ''
        const day = recIndex <= 0 ? d.getDay() : ''

        const key = [year, month, week, day].join('-')
        if (!datasets[key]) datasets[key] = [d, 0]
        if (dataType === 0) datasets[key][1]++
        if (dataType === 1) datasets[key][1] += t
        if (dataType === 2) datasets[key][1] += r
      })

      const name = this.seriesNames[this.selectType]
      const result = []
      Object.keys(datasets).forEach((key) => result.push(datasets[key]))

      return [
        {
          name,
          data: result,
        },
      ]
    },
    updateChart() {
      this.chartOptions = { ...this.chartOptions }
      this.series = this.getChartData()
    },
  },
}
</script>
