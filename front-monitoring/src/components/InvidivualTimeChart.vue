<template>
    <div class="time-chart" ref="chartContainer"></div>
</template>

<script>
import { ref, onMounted } from 'vue';
import Highcharts from 'highcharts';
import config from '../../config.js';

export default {
    name: 'IndividualTimeChart',
    setup() {
        const chartContainer = ref(null);
        let chartInstance = null;
        const seriesMap = new Map();

        onMounted(() => {
            chartInstance = Highcharts.chart(chartContainer.value, {
                chart: {
                    type: 'line'
                },
                title: {
                    text: 'General system response times'
                },
                yAxis: {
                    title: {
                        text: 'Resp. Times (ms)'
                    }
                },
                series: []
            });

        });

        const handleMessage = (event) => {
            const serverData = JSON.parse(event.data);
            updateChart(serverData.data);
        };

        const updateChart = (serverData) => {
    // Objeto para almacenar los datos de cada serie
    const seriesData = {};

    // Agrupar los datos por servidor
    serverData.forEach(server => {
        const serverName = extractServerName(server.server);

        if (!seriesData[serverName]) {
            seriesData[serverName] = [];
        }

        if (server.responseTimes && Array.isArray(server.responseTimes)) {
            server.responseTimes.forEach(time => {
                seriesData[serverName].push(time.timeDifference);
            });
        }
    });

    // Actualizar la gráfica con los datos de cada serie
    for (const serverName in seriesData) {
        const series = seriesMap.get(serverName);

        if (!series) {
            const newSeries = chartInstance.addSeries({
                name: serverName,
                data: seriesData[serverName]
            });
            seriesMap.set(serverName, newSeries);
        } else {
            series.setData(seriesData[serverName]);
        }
    }
};


        const extractServerName = (serverUrl) => {
            // Extraer el número del final del URL del servidor
            const parts = serverUrl.split('/');
            const lastPart = parts[parts.length - 1];
            const serverNumber = lastPart.split(':')[1];
            return serverNumber;
        };

        return { chartContainer, handleMessage };
    },

    created() {
        const socket = new WebSocket(config.baseURL);

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
