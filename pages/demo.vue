<template>
  <v-row>
    <v-col>
      <v-container v-if="errMsg" fluid>
        <v-row>
          <v-col>
            <pre>{{ errMsg }}</pre>
          </v-col>
        </v-row>
      </v-container>

      <v-container v-if="loading" fluid>
        <v-row class="fill-height" align-content="center" justify="center">
          <v-col class="subtitle-1 text-center" cols="12">
            Loading demo data
          </v-col>
          <v-col cols="6">
            <v-progress-linear
              height="7"
              color="primary"
              striped
              rounded
              indeterminate
            ></v-progress-linear>
          </v-col>
        </v-row>
      </v-container>

      <!-- // todo Move 'date range picker' to Filters (right drawer) -->
      <!-- <v-menu
        ref="dateRangePicker"
        v-model="dateRangePicker"
        :close-on-content-click="false"
        :return-value.sync="dateRange"
        transition="scale-transition"
        offset-y
        max-width="290px"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-text-field
            v-model="dateRangeText"
            label="Time period"
            prepend-inner-icon="mdi-calendar"
            single-line
            outlined
            class="ml-auto mr-auto mr-md-0"
            style="width: 290px"
            readonly
            hide-details
            v-bind="attrs"
            v-on="on"
          ></v-text-field>
        </template>
        <v-date-picker v-model="dateRange" no-title range>
          <v-spacer></v-spacer>
          <v-btn text color="primary" @click="menu = false">
            Cancel
          </v-btn>
          <v-btn
            text
            color="primary"
            @click="$refs.dateRangePicker.save(dateRange)"
          >
            OK
          </v-btn>
        </v-date-picker>
      </v-menu> -->

      <v-container v-if="!loading" fluid>
        <v-row>
          <v-col>
            <v-list-item two-line class="px-0">
              <v-list-item-avatar
                size="68"
                :color="
                  $vuetify.theme.dark
                    ? 'white black--text'
                    : 'black white--text'
                "
              >
                <span class="headline">
                  {{ user.firstName[0] }}{{ user.lastName[0] }}
                </span>
              </v-list-item-avatar>

              <v-list-item-content>
                <v-list-item-title class="headline text-wrap mb-1">
                  {{ greeting }} {{ user.firstName }}
                </v-list-item-title>
                <v-list-item-subtitle
                  v-if="dateRange[0]"
                  v-once
                  class="subtitle-2 text-wrap"
                >
                  Here are your stats from
                  {{ dateRange[0] | fDate }}
                </v-list-item-subtitle>
              </v-list-item-content>

              <v-list-item-action class="d-none d-sm-flex">
                <v-btn
                  :color="
                    $vuetify.theme.dark
                      ? 'white black--text'
                      : 'black white--text'
                  "
                  class="ma-2"
                  block
                >
                  Filters
                  <v-icon right dark>mdi-filter-variant</v-icon>
                </v-btn>
              </v-list-item-action>
            </v-list-item>
            <v-btn
              :color="$vuetify.theme.dark ? 'white black--text' : 'black'"
              class="ma-2 white--text d-flex d-sm-none"
              block
            >
              Filters
              <v-icon right dark>mdi-filter-variant</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-container>

      <v-container v-if="!loading" id="stats" fluid>
        <v-row>
          <v-col cols="12" sm="6" md="3">
            <v-card shaped>
              <v-card-title class="display-2">
                {{ stats.totalExercises }}
              </v-card-title>
              <v-card-text>Total exercises</v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <v-card shaped>
              <v-card-title class="display-2">
                {{ stats.secondsTrained | toHours }}
              </v-card-title>
              <v-card-text>
                Hours trained or {{ stats.secondsTrained | toDay }} days
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <v-card shaped>
              <v-card-title class="display-2">
                {{ stats.totalStars }}
              </v-card-title>
              <v-card-text>Earned stars</v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <v-card shaped>
              <v-card-title class="display-2">
                {{ stats.totalMeters }}
              </v-card-title>
              <v-card-text>
                Meters ran or {{ stats.totalMeters | toKm }} km
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>

      <v-container v-if="!loading" id="charts" fluid>
        <v-row>
          <v-col cols="12" class="mb-3">
            <area-chart
              :data="exercises"
              :theme="$vuetify.theme.dark ? 'dark' : 'light'"
            />
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12" lg="4">
            <donut-chart
              :data="exercises"
              :theme="$vuetify.theme.dark ? 'dark' : 'light'"
            />
          </v-col>
          <v-col cols="12" md="6" lg="4">
            <v-card>
              <v-card-title>
                <div>
                  Active days
                  <div class="subtitle-2 font-weight-regular text--secondary">
                    Trainings by time of day
                  </div>
                </div>
              </v-card-title>

              <v-card-text>
                <heatmap-chart
                  :data="exercises"
                  :theme="$vuetify.theme.dark ? 'dark' : 'light'"
                />
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12" md="6" lg="4">
            <v-card>
              <v-card-title>
                <div>
                  Running log
                  <div class="subtitle-2 font-weight-regular text--secondary">
                    Runs per month
                  </div>
                </div>
              </v-card-title>

              <v-card-text>
                <column-area-chart
                  :data="exercises"
                  :theme="$vuetify.theme.dark ? 'dark' : 'light'"
                />
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>

      <v-container v-if="!loading" id="table" fluid>
        <v-row>
          <v-col>
            <Table :data="exercises" />
          </v-col>
        </v-row>
      </v-container>
    </v-col>
  </v-row>
</template>

<script>
import dayjs from 'dayjs'
import Table from '../components/Table'
import AreaChart from '../components/Charts/Area'
import DonutChart from '../components/Charts/Donut'
import HeatmapChart from '../components/Charts/Heatmap'
import ColumnAreaChart from '../components/Charts/ColumnArea'

const demo = true

export default {
  components: {
    Table,
    AreaChart,
    DonutChart,
    HeatmapChart,
    ColumnAreaChart,
  },
  filters: {
    fDate(date) {
      date = new Date(date)
      return dayjs(date).format('dddd, MMM D, YYYY')
    },
    toHours(sec) {
      return Math.floor(sec / 3600)
    },
    toMin(sec) {
      return Math.floor(sec / 60)
    },
    toDay(sec) {
      return Math.floor(sec / 86400)
    },
    toKm(km) {
      return Math.floor(km / 1000)
    },
  },
  data() {
    return {
      loading: true,
      errMsg: null,
      greeting: 'Hello',
      user: {},
      exercises: [],
      stats: {},
      dateRangePicker: false,
      dateRange: [],
    }
  },
  computed: {
    dateRangeText() {
      return this.dateRange.join(' – ')
    },
  },
  created() {
    this.setGreeting()
    this.getUser(demo)
    this.getExercises(demo)
    this.getStats(demo)
  },
  methods: {
    showError(err) {
      this.errMsg = err
      this.loading = false
      // console.error(err)
    },
    setGreeting() {
      const hour = new Date().getHours()
      const greetings = ['Good morning ', 'Good afternoon ', 'Good evening ']
      const index = hour < 12 ? 0 : hour < 18 ? 1 : 2
      this.greeting = greetings[index]
    },
    async getUser() {
      try {
        this.user = await this.$store.dispatch('getUser')
      } catch (err) {
        this.showError(err)
      }
    },
    async getExercises() {
      try {
        this.exercises = await this.$store.dispatch('getExercises')
        this.setDateRange()
      } catch (err) {
        this.showError(err)
      }
    },
    setDateRange() {
      let from = this.exercises[this.exercises.length - 1].date
      let to = this.exercises[0].date
      from = from.split('T')[0]
      to = to.split('T')[0]
      this.dateRange = [from, to]
      this.loading = false
    },
    async getStats() {
      this.stats = await this.$store.dispatch('getStats')
    },
  },
  head: {
    title: 'Demo page',
  },
}
</script>
