<template>
    <div class="time-chart" ref="chartContainer"></div>
</template>

<script>
import { ref, onMounted } from 'vue';
import Highcharts from 'highcharts';

export default {
    name: 'TimeChart',
    setup() {
        const chartContainer = ref(null);
        let chartInstance = null;

        onMounted(() => {
            chartInstance = Highcharts.chart(chartContainer.value, {
                chart: {
                    type: 'line'
                },
                title: {
                    text: 'System Response Times'
                },
                yAxis: {
                    title: {
                        text: 'Resp. Times (ms)'
                    }
                },
                series: [{
                    name: 'System Response Times',
                    data: []
                }]
            });
        });

        const handleMessage = (event) => {
            const serverData = JSON.parse(event.data);
            updateChart(serverData.data);
        };

        const updateChart = (serverData) => {
            const responseTimes = [];

            serverData.forEach(server => {
                if (server.responseTimes && Array.isArray(server.responseTimes)) {
                    server.responseTimes.forEach(time => {
                        responseTimes.push(time.timeDifference);
                    });
                } 
            });

            chartInstance.series[0].setData(responseTimes);
        };

        return { chartContainer, handleMessage };
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
    }
};
</script>

<style scoped>
.time-chart {
    width: 100%;
    height: 350px;
    background-color: rgb(215, 246, 236);
    width: 70%;
}
</style>