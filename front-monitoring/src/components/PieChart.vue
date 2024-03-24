<template>
    <div class="request-count-pie-chart-container">
        <div class="request-info">
            <h3>HTTP Methods</h3>
            <p>GET {{ getRequests }}</p>
            <p>POST {{ postRequests }}</p>
            <p>PATCH {{ patchRequests }}</p>
        </div>
        <canvas ref="requestCountPieChart"></canvas>
    </div>
</template>

<script>
import Chart from 'chart.js/auto';

export default {
    name: 'PieChart',
    data() {
        return {
            getRequests: 0,
            postRequests: 0,
            patchRequests: 0,
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
            chartInstance: null,
        };
    },

    created() {
        const socket = new WebSocket("ws://localhost:5000");

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

            if (
                getRequests !== this.chartData.datasets[0].data[0] ||
                postRequests !== this.chartData.datasets[0].data[1] ||
                patchRequests !== this.chartData.datasets[0].data[2]
            ) {
                this.getRequests = getRequests;
                this.postRequests = postRequests;
                this.patchRequests = patchRequests;
                this.updateChartData(getRequests, postRequests, patchRequests);
            }
        },

        updateChartData(getCount, postCount, patchCount) {
            this.chartInstance.data.datasets[0].data = [getCount, postCount, patchCount];
            this.chartInstance.update();
        },
    },
    mounted() {
        this.chartInstance = new Chart(this.$refs.requestCountPieChart, {
            type: 'pie',
            data: this.chartData,
            options: this.chartOptions,
        });
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

.request-info {
    flex: 1;
    margin-right: 20px;
}
</style>