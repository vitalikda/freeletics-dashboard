<script>
import { Line } from "vue-chartjs";

export default {
  extends: Line,
  props: ["datasets"],
  mounted() {
    this.renderChart(
      {
        labels: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sept",
          "Oct",
          "Nov",
          "Dec"
        ],
        datasets: this.datasets
      },
      { responsive: true, maintainAspectRatio: false }
    );
  }
};
</script>
