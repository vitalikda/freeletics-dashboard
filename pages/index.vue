<template>
  <v-row>
    <v-col>
      <v-container v-show="currentStatus === 3" fluid>
        <v-row>
          <v-col>
            <pre>{{ errorText }}</pre>
          </v-col>
        </v-row>
      </v-container>

      <v-container v-show="currentStatus === 0" fluid>
        <v-row justify="center" align="center">
          <v-col cols="12" sm="8" md="6">
            <v-card>
              <v-card-title class="headline">
                Upload your Freeletics' data (YAML file)
              </v-card-title>
              <v-card-text>
                <input
                  type="file"
                  @change="fileChange($event.target.files)"
                  accept=".yaml, .yml"
                />
                <!-- <pre>{{ workouts }}</pre> -->
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>

      <v-container v-show="currentStatus === 2" fluid>
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
          <v-col cols="12" sm="3">
            <v-btn @click="reset" dark large>
              UPLOAD NEW FILE
            </v-btn>
          </v-col>
        </v-row>
      </v-container>

      <v-container fluid>
        <v-row>
          <v-col>
            <line-chart v-if="currentStatus === 2" :datasets="chartData" />
          </v-col>
        </v-row>
      </v-container>

      <v-container v-show="currentStatus === 2" fluid>
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
                  <tr v-for="(item, idx) in workouts" :key="idx">
                    <td>{{ item.workout }}</td>
                    <td>
                      {{ formatDate(item.performed_at) }}
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
    </v-col>
  </v-row>
</template>

<script>
import yaml from "js-yaml";
import dayjs from "dayjs";
import { timestrToSec, secToHrs, calcWorkouts } from "../utils";
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
      currentStatus: STATUS_INITIAL,
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
  methods: {
    reset() {
      this.currentStatus = STATUS_INITIAL;
      this.errorText = null;
      this.workoutStats = {
        totalWorkouts: 0,
        hoursTrained: 0,
        yearsTrained: 0
      };
      this.chartData = null;
    },
    fileChange(files) {
      this.currentStatus = STATUS_LOADING;
      var file = files[0];
      if (file) {
        const fr = new FileReader();
        fr.readAsText(file);
        fr.onload = e => this.processFile(e.target.result);
      }
    },
    processFile(content) {
      try {
        this.workouts = yaml.safeLoad(content).training.trainings;
        this.getWorkoutStats();
      } catch (e) {
        this.currentStatus = STATUS_FAILED;
        this.errorText = e;
        console.log(e);
      }
    },
    async getWorkoutStats() {
      try {
        this.workoutStats.totalWorkouts = this.workouts.length;
        this.workoutStats.hoursTrained = await secToHrs(
          this.workouts
            .filter(item => {
              if (item.time) {
                return true;
              }
            })
            .reduce((total, item) => {
              return total + timestrToSec(item.time);
            }, 0)
        );
        this.workoutStats.yearsTrained = await dayjs().diff(
          this.workouts[this.workouts.length - 1].performed_at,
          "year"
        );
        this.chartData = await calcWorkouts(this.workouts);
        this.currentStatus = STATUS_SUCCESS;
      } catch (e) {
        this.currentStatus = STATUS_FAILED;
        this.errorText = e;
        console.log(e);
      }
    },
    formatDate(date) {
      date = new Date(date);
      return dayjs(date).format("DD MMM YYYY HH:mm:ss");
    }
  }
};
</script>
