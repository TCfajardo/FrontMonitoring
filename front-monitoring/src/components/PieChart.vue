<template>
    <div class="request-count-pie-chart-container">
        <canvas ref="requestCountPieChart"></canvas>
    </div>
</template>

<script>
import Chart from 'chart.js/auto';

export default {
    name: 'PieChart',
    data() {
        return {
            chartData: {
                labels: ['GET', 'POST', 'PATCH'],
                datasets: [
                    {
                        data: [0, 0, 0],
                        backgroundColor: [
                            'rgba(54, 162, 235, 0.2)',
                            'rgba(255, 206, 86, 0.2)',
                            'rgba(75, 192, 192, 0.2)',
                        ],
                        borderColor: [
                            'rgba(54, 162, 235, 1)',
                            'rgba(255, 206, 86, 1)',
                            'rgba(75, 192, 192, 1)',
                        ],
                        borderWidth: 1,
                    },
                ],
            },
            chartOptions: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                },
            },
        };
    },
    created() {
        const socket = new WebSocket("ws://localhost:4000");

        socket.onopen = () => {
            console.log("Conexión WebSocket establecida");
        };

        socket.onerror = (error) => {
            console.error("Error en la conexión WebSocket:", error);
        };

        socket.onmessage = this.handleMessage;

        this.socket = socket;
    },
    destroyed() {
        if (this.socket) {
            this.socket.close();
        }
    },
    methods: {
        handleMessage(event) {
            const serverData = JSON.parse(event.data);
            console.log('Server data:', serverData);

            const { getRequests, postRequests, patchRequests } = serverData.data[0];

            this.updateChartData(getRequests, postRequests, patchRequests);
        },
        updateChartData(getCount, postCount, patchCount) {
            this.chartData.datasets[0].data = [getCount, postCount, patchCount];
        },
    },
    mounted() {
        const chartInstance = new Chart(this.$refs.requestCountPieChart, {
            type: 'pie',
            data: this.chartData,
            options: this.chartOptions,
        });

        this.$watch(
            () => this.chartData,
            (newData) => {
                chartInstance.data = newData;
                chartInstance.update();
            },
            { deep: true }
        );
    },
};
</script>

<style scoped>
.request-count-pie-chart-container {
    margin: 2%;
    padding: 1%;
    height: 200px;
    background-color: #ffffff;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    display: flex;
    flex-wrap: wrap;
    width: 400px;
    align-items: center;
}
</style>