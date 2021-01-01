<template>
  <v-card>
    <v-card-title>
      Exercises
      <v-spacer></v-spacer>
      <v-text-field
        v-model="search"
        prepend-inner-icon="mdi-magnify"
        class="mt-0 pt-0"
        label="Search..."
        single-line
        hide-details
      ></v-text-field>
    </v-card-title>

    <v-data-table
      :headers="headers"
      :items="data"
      :search="search"
      :items-per-page="5"
      class="elevation-1"
    >
      <template v-slot:[`item.name`]="{ item }">
        <span class="cap">{{ item.name }}</span>
      </template>
      <template v-slot:[`item.date`]="{ item }">
        {{ item.date | fDate }}
      </template>
      <template v-slot:[`item.star`]="{ item }">
        <v-icon>{{ item.star | selectIcon }}</v-icon>
      </template>
      <template v-slot:[`item.time`]="{ item }">
        {{ item.time | fTime }}
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
import dayjs from 'dayjs'

export default {
  filters: {
    fDate(date) {
      date = new Date(date)
      return dayjs(date).format('ddd, MMM D YYYY, h:mm A')
    },
    selectIcon(star) {
      let icon = ''
      if (star === 0) icon = 'mdi-star-off-outline'
      if (star === 1) icon = 'mdi-star'
      if (star === 2) icon = 'mdi-star-check'
      return icon
    },
    fTime(time) {
      const date = new Date(0)
      date.setSeconds(time)
      const hhmmss = date.toISOString().substr(11, 8)
      return hhmmss
    },
  },
  props: {
    data: {
      type: Array,
      default() {
        return '[]'
      },
    },
  },
  data() {
    return {
      search: '',
      headers: [
        {
          text: 'Name',
          align: 'start',
          sortable: false,
          value: 'name',
        },
        { text: 'Date', value: 'date' },
        { text: 'Star', value: 'star' },
        { text: 'Repetitions', value: 'reps' },
        { text: 'Time', value: 'time' },
      ],
    }
  },
}
</script>

<style scoped>
.cap {
  text-transform: capitalize;
}
</style>
