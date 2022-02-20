import { HorizontalBar, mixins } from "vue-chartjs";
const { reactiveProp } = mixins;

export default {
  extends: HorizontalBar,
  mixins: [reactiveProp],
  props: ["minValue", "maxValue"],
  data() {
    return {
      options: {
        animation: false,
        responsive: true,
        maintainAspectRatio: false,
        legend: {
          display: false
        },
        tooltips: {
          callbacks: {
            title: function (context) {
              return (context[0].label.split("|"))[1]
            },
            label: function (context) {
              return new Intl.NumberFormat('en-US').format(context.value ? context.value * 1e6 : 0);
            }
          }
        },
        scales: {
          yAxes: [
            {
              ticks: {
                callback: function (value, index, values) {
                  return (value.split("|"))[0];
                }
              },
              gridLines: {
                display: true,
              },
            },
          ],
          xAxes: [
            {
              ticks: {
                beginAtZero: false,
                stepSize: 1000,
                maxRotation: 90,
                minRotation: 90,
                callback: function (value, index, values) {
                  return +value.toFixed(2) + " M";
                },
              },
              gridLines: {
                display: true,
              },
            },
          ],
        },
      },
    };
  },
  mounted() {
    this.renderChart(this.chartData, this.options);
  },
};