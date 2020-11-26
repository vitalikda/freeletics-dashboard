<template>
  <v-row>
    <v-col>
      <v-container fluid>
        <v-row>
          <v-col cols="12" sm="4">
            <v-card shaped>
              <v-card-title class="display-2">
                {{ totalWorkouts }}
              </v-card-title>
              <v-card-text>Total workouts</v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12" sm="4">
            <v-card shaped>
              <v-card-title class="display-2">
                {{ hoursTrained }}
              </v-card-title>
              <v-card-text>Hours trained</v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12" sm="4">
            <v-card shaped>
              <v-card-title class="display-2">
                {{ yearsTrained }}
              </v-card-title>
              <v-card-text>Years trained</v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>

      <v-container fluid>
        <v-row>
          <v-col>
            <line-chart v-if="loaded" :datasets="chartData" />
          </v-col>
        </v-row>
      </v-container>

      <!-- <pre>{{ chartData }}</pre> -->

      <v-container fluid>
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
                  <tr v-for="item in workouts" :key="item.performed_at">
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

      <!-- <pre v-for="(item, idx) in workouts" :key="idx">
        {{ item }}
      </pre> -->
    </v-col>
  </v-row>
</template>

<script>
import dayjs from "dayjs";
import { timestrToSec, secToHrs, calcWorkouts } from "../utils";
import LineChart from "../components/LineChart";

export default {
  components: {
    LineChart
  },
  data() {
    return {
      loaded: false,
      workouts: [],
      totalWorkouts: 0,
      hoursTrained: 0,
      yearsTrained: 0,
      chartData: null
    };
  },
  async fetch() {
    const data = await this.$content("/data").fetch();
    this.workouts = data.training.trainings;
  },
  methods: {
    formatDate(date) {
      return dayjs(date).format("DD MMM YYYY HH:mm:ss");
    }
  },
  async mounted() {
    this.loaded = false;
    try {
      this.totalWorkouts = await this.workouts.length;
      this.hoursTrained = await secToHrs(
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
      this.yearsTrained = await dayjs().diff(
        this.workouts[this.totalWorkouts - 1].performed_at,
        "year"
      );
      this.chartData = await calcWorkouts(this.workouts);
      this.loaded = true;
    } catch (error) {
      console.error(error);
    }
  }
};
</script>
