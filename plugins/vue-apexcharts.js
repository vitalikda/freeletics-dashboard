import Vue from 'vue'
import VueApexCharts from 'vue-apexcharts'

Vue.use({
  install(Vue) {
    Vue.component('apexchart', VueApexCharts)
  },
})
