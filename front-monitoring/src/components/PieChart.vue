<template>
    <div class="request-chart">
      <canvas ref="chartCanvas"></canvas>
    </div>
  </template>
  
  <script>
  import Chart from 'chart.js/auto';
  
  export default {
    name: 'RequestChart',
    props: {
      requestData: {
        type: Object,
        required: true
      }
    },
    mounted() {
      this.renderChart();
    },
    methods: {
      renderChart() {
        const ctx = this.$refs.chartCanvas.getContext('2d');
  
        const myChart = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: ['GET', 'POST', 'PATCH'],
            datasets: [{
              label: 'Número de peticiones',
              data: [
                this.requestData.GET || 0,
                this.requestData.POST || 0,
                this.requestData.PATCH || 0
              ],
              backgroundColor: [
                'rgba(255, 99, 132, 0.2)', // GET
                'rgba(54, 162, 235, 0.2)',  // POST
                'rgba(255, 206, 86, 0.2)'   // PATCH
              ],
              borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)'
              ],
              borderWidth: 1
            }]
          },
          options: {
            scales: {
              y: {
                beginAtZero: true
              }
            }
          }
        });
  
        this.$nextTick(() => {
          const canvas = this.$refs.chartCanvas;
          canvas.width = 400;
          canvas.height = 400;
          myChart.resize();
        });
      }
    }
  };
  </script>
  
  <style scoped>
  .request-chart {
    width: 100%;
    height: 100%;
    background-color: aqua;
  }
  </style>
  