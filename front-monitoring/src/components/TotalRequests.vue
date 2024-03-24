<template>
    <div class="server-requests">
        <div class="request-info">
            <h3>Requests Overview</h3>
            <p>Total Requests: {{ totalRequests }}</p>
            <p>Error Responses: {{ errorResponses }}</p>
            <p>Error Percentage: {{ computedErrorPercentage.toFixed(2) }}%</p>
        </div>
        <div class="chart-container">
            <canvas id="doughnutChart" :width="width" :height="height"></canvas>
        </div>
    </div>
</template>

<script>
import Chart from 'chart.js/auto';
import config from '../../config.js';

export default {
    name: 'TotalRequests',
    data() {
        return {
            totalRequests: 0,
            errorResponses: 0,
            width: 400,
            height: 200,
        };
    },
    computed: {
        computedErrorPercentage() {
            if (this.totalRequests === 0 || this.errorResponses === 0) {
                return 0;
            } else {
                return (this.errorResponses / this.totalRequests) * 100;
            }
        },
    },
    created() {
        const socket = new WebSocket(config.baseURL);

        socket.onopen = () => {
            console.log("Conexión WebSocket establecida");
        };

        socket.onerror = (error) => {
            console.error("Error en la conexión WebSocket:", error);
        };

        socket.onmessage = (event) => {
            this.handleMessage(event);
        };

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
            const data = serverData.data[0];
            this.totalRequests = data.totalRequests;
            this.errorResponses = data.errorRequests;
            this.updateChart();
        },
        updateChart() {
            const doughnutData = {
                labels: ["Error Responses", "Successful Responses"],
                datasets: [
                    {
                        data: [this.errorResponses, this.totalRequests - this.errorResponses],
                        backgroundColor: ["red", "#ebe7e7"],
                        borderColor: "white",
                        borderWidth: 1
                    }
                ]
            };

            // Verificar si el gráfico ya está creado
            if (this.chartInstance) {
                // Desactivar la animación
                this.chartInstance.options.animation = false;

                // Actualizar los datos del gráfico existente
                this.chartInstance.data.datasets.forEach((dataset, index) => {
                    dataset.data = doughnutData.datasets[index].data;
                });
                this.chartInstance.update();
            } else {
                const canvas = document.getElementById('doughnutChart');
                const ctx = canvas.getContext('2d');

                const chartOptions = {
                    cutoutPercentage: 50, // 50% para que se vea como un donut
                    animation: {
                        animateRotate: false,
                        animateScale: false // Desactivar la animación al crear el gráfico
                    }
                };

                // Crear un nuevo gráfico si no existe
                this.chartInstance = new Chart(ctx, {
                    type: 'doughnut',
                    data: doughnutData,
                    options: chartOptions
                });
            }
        }
    }
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
</style>
