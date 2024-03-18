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
            totalRequests: 1980,
            errorResponses: 100,
            width: 1100,
            height: 400,
        };
    },
    created() {
        this.setupWebSocket();
    },
    methods: {
        setupWebSocket() {
            // Configurar WebSocket
        },
        updateRequests() {
            // Actualizar datos
        },
    },
    computed: {
        errorPercentage() {
            return this.totalRequests === 0 ? 0 : (this.errorResponses / this.totalRequests) * 100;
        }
    },
    mounted() {
        const ctx = document.getElementById('oilChart').getContext('2d');

        const oilData = {
            labels: ["Errors", "Requests"],
            datasets: [
                {
                    data: [100, 1980],
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
            myChart.aspectRatio = this.width / this.height;
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
    flex: 1; /* Hace que ocupe el espacio disponible */
    margin-right: 20px; /* Espaciado entre los elementos */
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
