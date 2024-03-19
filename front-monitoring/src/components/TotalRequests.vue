<template>
    <div class="server-requests">
        <div class="request-info">
            <h2>Requests Overview</h2>
            <p>Total Requests: {{ totalRequests }}</p>
            <p>Error Responses: {{ errorResponses }}</p>
            <p>Error Percentage: {{ errorPercentage.toFixed(2) }}%</p> <!-- Aquí se utiliza toFixed(2) -->
        </div>
        <div class="chart-container">
            <canvas id="oilChart" :style="{ width: width + 'px' }"></canvas>
        </div>
    </div>
</template>

<script>
import Chart from 'chart.js/auto';

export default {
    name: 'TotalRequests',
    data() {
        return {
            totalRequests: 0,
            errorResponses: 0,
            width: 1100,
            height: 400,
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
            console.log('serve data  ', serverData);
            const data = serverData.data[0];
            this.totalRequests = data.totalRequests;
            this.errorResponses = data.errorRequests;
        },
    },
    computed: {
        errorPercentage() {
            if (this.totalRequests === 0 || this.errorResponses === 0) {
                return 0;
            } else {
                return (this.errorResponses / this.totalRequests) * 100;
            }
        },
    },
    mounted() {
    const ctx = document.getElementById('oilChart').getContext('2d');

    const oilData = {
        labels: ["Errors", "Requests"],
        datasets: [
            {
                data: [8, 153],
                backgroundColor: ["red", "#ebe7e7"],
                borderColor: "white",
                borderWidth: 1
            }
        ]
        
    };
    
    const chartOptions = {
            rotation: -Math.PI,
            cutoutPercentage: 0,
            circumference: Math.PI,
            legend: {
                position: 'left'
            },
            animation: {
                animateRotate: false,
                animateScale: true
            }
        };

        const myChart = new Chart(ctx, {
            type: 'doughnut',
            data: oilData,
            options: chartOptions
        });

        this.$nextTick(() => {
            const canvas = document.getElementById('oilChart');
            canvas.width = this.width;
            canvas.height = this.height;
            myChart.resize();

        });
    },
};
</script>

<style scoped>
.server-requests {
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

.chart-container {
    height: 200px;
}

canvas {
    width: 100%;
    height: 100%;
    padding: 1%;
}
</style>
