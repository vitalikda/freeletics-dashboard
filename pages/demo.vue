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

      <v-container id="workout-stats" v-show="status === 2" fluid>
        <v-row>
          <v-col cols="12" sm="3">
            <v-card shaped>
              <v-card-title class="display-2">
                {{ workoutStats.totalWorkouts | fInteger }}
              </v-card-title>
              <v-card-text>Total workouts</v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12" sm="3">
            <v-card shaped>
              <v-card-title class="display-2">
                {{ workoutStats.hoursTrained | fInteger }}
              </v-card-title>
              <v-card-text>Hours trained</v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12" sm="3">
            <v-card shaped>
              <v-card-title class="display-2">
                {{ workoutStats.yearsTrained | fInteger }}
              </v-card-title>
              <v-card-text>Years trained</v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12" sm="3">
            <v-card shaped>
              <v-card-title class="display-2">
                {{ workoutStats.workoutsPerWeek | fInteger }}
              </v-card-title>
              <v-card-text>Workouts per week</v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>

      <v-container id="line-chart" v-if="status === 2" fluid>
        <v-row>
          <v-col cols="12" sm="8">
            <v-card>
              <v-card-text>
                <line-chart :datasets="lineChartData" />
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12" sm="4">
            <v-card>
              <v-card-text>
                <doughnut-chart
                  :labels="doughnutChartData.labels"
                  :datasets="doughnutChartData.datasets"
                />
              </v-card-text>
            </v-card>
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
    </v-col>
  </v-row>
</template>

<script>
import dayjs from "dayjs";
import {
  calculateTrainedHours,
  getWorkoutsDataForLineChart,
  getWorkoutsDataForDoughnutChart
} from "../utils";
import LineChart from "../components/LineChart";
import DoughnutChart from "../components/DoughnutChart";

const STATUS_INITIAL = 0,
  STATUS_LOADING = 1,
  STATUS_SUCCESS = 2,
  STATUS_FAILED = 3;

export default {
  components: {
    LineChart,
    DoughnutChart
  },
  data() {
    return {
      status: STATUS_INITIAL,
      errorText: null,
      workouts: null,
      workoutStats: {
        totalWorkouts: 0,
        hoursTrained: 0,
        yearsTrained: 0,
        workoutsPerWeek: 0
      },
      lineChartData: null,
      doughnutChartData: null,
      doughnutChartOutputLength: 5
    };
  },
  async fetch() {
    const data = await this.$content("/data").fetch();
    this.workouts = data.training.trainings;
    this.getWorkoutStats();
  },
  filters: {
    fDate(date) {
      date = new Date(date);
      return dayjs(date).format("DD MMM YYYY HH:mm:ss");
    },
    fInteger(number) {
      return Math.floor(number);
    }
  },
  methods: {
    showError(e) {
      this.status = STATUS_FAILED;
      this.errorText = e;
      console.log(e);
    },
    async getWorkoutStats() {
      try {
        this.workoutStats.totalWorkouts = this.workouts.length;
        this.workoutStats.hoursTrained = await calculateTrainedHours(
          this.workouts
        );
        this.workoutStats.yearsTrained = await dayjs().diff(
          this.workouts[this.workouts.length - 1].performed_at,
          "year"
        );
        this.workoutStats.workoutsPerWeek =
          this.workouts.length /
          (await dayjs(this.workouts[0].performed_at).diff(
            this.workouts[this.workouts.length - 1].performed_at,
            "week"
          ));
        this.lineChartData = await getWorkoutsDataForLineChart(this.workouts);
        this.doughnutChartData = await getWorkoutsDataForDoughnutChart(
          this.workouts,
          this.doughnutChartOutputLength
        );
        this.status = STATUS_SUCCESS;
      } catch (e) {
        this.showError(e);
      }
    }
  }
};
</script>
