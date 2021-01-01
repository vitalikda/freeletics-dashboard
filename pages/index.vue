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

      <v-container v-show="upload" fluid>
        <v-row justify="center" align="center">
          <v-col cols="12" sm="8" md="6">
            <v-card>
              <v-card-title>
                <div>
                  Upload your file
                  <div class="subtitle-2 font-weight-regular text--secondary">
                    File has to have YAML extension (.yml, .yaml)
                  </div>
                </div>
              </v-card-title>

              <v-card-text
                class="grey text-center pa-1"
                :class="$vuetify.theme.dark ? 'darken-3' : 'lighten-4'"
              >
                <div v-if="loading" class="pa-14">
                  <v-progress-circular
                    class="mt-10 mb-4"
                    indeterminate
                    :size="60"
                  ></v-progress-circular>
                  <p class="subtitle-1">Loading your data...</p>
                  <v-btn text small disabled>or browse</v-btn>
                </div>
                <div
                  v-cloak
                  v-else
                  id="dropzone"
                  class="pa-14"
                  @drop.prevent="dropFile"
                  @dragover.prevent
                  @click="$refs.fileUpload.click()"
                >
                  <v-icon class="mt-10 mb-4" size="60">
                    mdi-folder-open
                  </v-icon>
                  <p class="subtitle-1">Drag & Drop your files here</p>
                  <v-btn text small @click="$refs.fileUpload.click()">
                    or browse
                  </v-btn>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
        <!-- For file upload -->
        <input
          v-show="false"
          ref="fileUpload"
          type="file"
          name="file"
          accept=".yaml, .yml"
          @change="addFile"
        />
      </v-container>

      <v-container v-if="!loading && !upload" fluid>
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
                  @click="resetData()"
                >
                  Clear data
                  <v-icon right dark>mdi-delete</v-icon>
                </v-btn>
              </v-list-item-action>
            </v-list-item>
            <v-btn
              :color="$vuetify.theme.dark ? 'white black--text' : 'black'"
              class="ma-2 white--text d-flex d-sm-none"
              block
              @click="resetData()"
            >
              Clear data
              <v-icon right dark>mdi-delete</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-container>

      <v-container v-if="!loading && !upload" id="stats" fluid>
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

      <v-container v-if="!loading && !upload" id="charts" fluid>
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

      <v-container v-if="!loading && !upload" id="table" fluid>
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
      upload: true,
      loading: false,
      errMsg: null,
      greeting: 'Hello',
      user: {},
      exercises: [],
      stats: {},
      dateRangePicker: false,
      dateRange: [],
    }
  },
  created() {
    this.setGreeting()
  },
  methods: {
    showError(err) {
      this.errMsg = err
      this.upload = false
      this.loading = false
      // console.error(err)
    },
    resetData() {
      this.upload = true
      this.loading = false
      this.errMsg = null
      this.greeting = 'Hello'
      this.user = {}
      this.exercises = []
      this.stats = {}
      this.dateRangePicker = false
      this.dateRange = []

      this.$axios.post('/api/file/delete')
    },
    addFile(e) {
      const file = e.target.files[0]
      this.handleFileUpload(file)
    },
    dropFile(e) {
      const file = e.dataTransfer.files[0]
      this.handleFileUpload(file)
    },
    async handleFileUpload(file) {
      if (!file.type.includes('yaml')) {
        this.showError('Not YAML file')
        return
      }

      this.loading = true
      const formData = new FormData()
      formData.set('file', file)

      try {
        // eslint-disable-next-line no-unused-vars
        await this.$axios
          .post('/api/file/upload', formData, {
            header: {
              'Content-Type': 'multipart/form-data',
            },
          })
          .then((res) => {
            this.getUser()
            this.getExercises()
            this.getStats()
          })
      } catch (err) {
        this.showError(err)
      }
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
        this.setDateRange(this.exercises)
      } catch (err) {
        this.showError(err)
      }
    },
    setDateRange(exercises) {
      const from = exercises[exercises.length - 1].date.split('T')[0]
      const to = exercises[0].date.split('T')[0]
      // from = from.split('T')[0]
      // to = to.split('T')[0]
      this.dateRange = [from, to]
      // Remove loading state in Upload form
      this.loading = false
      this.upload = false
    },
    async getStats() {
      this.stats = await this.$store.dispatch('getStats')
    },
  },
  head: {
    title: 'Dashboard',
  },
}
</script>

<style scoped>
.file-loading {
  animation: loader 1s infinite;
  display: flex;
}
@-moz-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@-webkit-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@-o-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
