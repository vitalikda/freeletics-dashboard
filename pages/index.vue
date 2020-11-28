<template>
  <v-row>
    <v-col>
      <v-container v-show="status === 3" fluid>
        <v-row>
          <v-col>
            <pre>{{ errorText }}</pre>
          </v-col>
        </v-row>
      </v-container>

      <v-container v-show="status < 2" fluid>
        <v-row justify="center" align="center">
          <v-col cols="12" sm="8" md="6">
            <v-card :loading="status === 1" min-height="300">
              <v-card-title class="headline">
                Upload your file
              </v-card-title>
              <v-card-text
                class="grey text-center pa-1"
                :class="$vuetify.theme.dark ? 'darken-3' : 'lighten-4'"
              >
                <div
                  id="dropzone"
                  class="pa-14"
                  v-cloak
                  @drop.prevent="dropFile"
                  @dragover.prevent
                  @click="$refs.fileUpload.click()"
                >
                  <v-icon class="mt-10 mb-4" size="60">
                    mdi-file-upload
                  </v-icon>
                  <p class="subtitle-1">
                    Drag & Drop to Upload
                  </p>
                  <v-btn @click="$refs.fileUpload.click()" text small>
                    or browse
                  </v-btn>

                  <li
                    v-for="(file, i) in files"
                    :key="i"
                    class="list-group-item mb-3 border-top"
                  >
                    {{ file.name }} ({{ file.size | kb }} kb)
                  </li>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>

      <v-container id="workout-stats" v-show="status === 2" fluid>
        <v-row>
          <v-col cols="12" sm="3">
            <v-card shaped>
              <v-card-title class="display-2">
                {{ workoutStats.totalWorkouts }}
              </v-card-title>
              <v-card-text>Total workouts</v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12" sm="3">
            <v-card shaped>
              <v-card-title class="display-2">
                {{ workoutStats.hoursTrained }}
              </v-card-title>
              <v-card-text>Hours trained</v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12" sm="3">
            <v-card shaped>
              <v-card-title class="display-2">
                {{ workoutStats.yearsTrained }}
              </v-card-title>
              <v-card-text>Years trained</v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>

      <v-container id="line-chart" v-if="status === 2" fluid>
        <v-row>
          <v-col>
            <line-chart :datasets="chartData" />
          </v-col>
        </v-row>
      </v-container>

      <v-container id="workout-table" v-show="status === 2" fluid>
        <v-row>
          <v-col>
            <h1>Workouts</h1>
            <v-simple-table fixed-header height="300px">
              <template v-slot:default>
                <thead>
                  <tr>
                    <th class="text-left">Name</th>
                    <th class="text-left">Date</th>
                    <th class="text-left">Star</th>
                    <th class="text-left">Time</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, i) in workouts" :key="i">
                    <td>{{ item.workout }}</td>
                    <td>
                      {{ item.performed_at | fDate }}
                    </td>
                    <td>
                      <v-icon>
                        {{
                          item.personal_best
                            ? "mdi-star-check"
                            : !item.personal_best && item.star
                            ? "mdi-star"
                            : "mdi-star-off-outline"
                        }}
                      </v-icon>
                    </td>
                    <td>{{ item.time }}</td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
          </v-col>
        </v-row>
      </v-container>

      <v-fab-transition>
        <v-btn
          @click="$refs.fileUpload.click()"
          :loading="status === 1"
          fab
          dark
          fixed
          bottom
          right
        >
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </v-fab-transition>

      <!-- For file upload -->
      <input
        v-show="false"
        type="file"
        ref="fileUpload"
        @change="addFile"
        accept=".yaml, .yml"
      />
    </v-col>
  </v-row>
</template>

<script>
import yaml from "js-yaml";
import dayjs from "dayjs";
import { calcHours, calcWorkouts } from "../utils";
import LineChart from "../components/LineChart";

const STATUS_INITIAL = 0,
  STATUS_LOADING = 1,
  STATUS_SUCCESS = 2,
  STATUS_FAILED = 3;

export default {
  components: {
    LineChart
  },
  data() {
    return {
      files: [],
      status: STATUS_INITIAL,
      errorText: null,
      workouts: null,
      workoutStats: {
        totalWorkouts: 0,
        hoursTrained: 0,
        yearsTrained: 0
      },
      chartData: null
    };
  },
  filters: {
    kb(val) {
      return Math.floor(val / 1024);
    },
    fDate(date) {
      date = new Date(date);
      return dayjs(date).format("DD MMM YYYY HH:mm:ss");
    }
  },
  methods: {
    reset() {
      this.status = STATUS_INITIAL;
      this.errorText = null;
      this.workoutStats = {
        totalWorkouts: 0,
        hoursTrained: 0,
        yearsTrained: 0
      };
      this.chartData = null;
    },
    showError(e) {
      this.status = STATUS_FAILED;
      this.errorText = e;
      console.log(e);
    },
    addFile(e) {
      let file = e.target.files[0];
      this.handleFile(file);
    },
    dropFile(e) {
      let file = e.dataTransfer.files[0];
      this.handleFile(file);
    },
    handleFile(file) {
      this.reset();
      this.status = STATUS_LOADING;

      if (file.type.indexOf("yaml") >= 0) {
        const fr = new FileReader();
        fr.readAsText(file);
        fr.onload = () => this.getWorkouts(fr.result);
      }
    },
    getWorkouts(content) {
      try {
        this.workouts = yaml.safeLoad(content).training.trainings;
        this.getWorkoutStats();
      } catch (e) {
        this.showError(e);
      }
    },
    async getWorkoutStats() {
      try {
        this.workoutStats.totalWorkouts = this.workouts.length;
        this.workoutStats.hoursTrained = await calcHours(this.workouts);
        this.workoutStats.yearsTrained = await dayjs().diff(
          this.workouts[this.workouts.length - 1].performed_at,
          "year"
        );
        this.chartData = await calcWorkouts(this.workouts);
        this.status = STATUS_SUCCESS;
      } catch (e) {
        this.showError(e);
      }
    }
  }
};
</script>

<style scoped>
#dropzone {
  transition: opacity 0.4s ease-in-out;
}
#dropzone:hover {
  opacity: 0.75;
}
</style>
