<template>
    <div class="container">    
        <div class="chart-container" ref="chartContainer"></div>
        <div class="logs-container">
            <p>{{ serverLogs.length > 0 ? 'Average response time: ' + calculateAverageResponseTime().toFixed(3) + ' ms' : 'Average response time: 0 ms' }}</p>
            <ul class="logs">
                <li v-for="log in serverLogs" :key="log.id">
                    {{ log.formattedTimestamp }} - Server {{ log.server }} did not reply
                </li>
            </ul>
        </div>
    </div>
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
        const serverLogs = ref([]);

        onMounted(() => {
            chartInstance = Highcharts.chart(chartContainer.value, {
                chart: {
                    type: 'line'
                },
                title: {
                    text: ''
                },
                xAxis: {
                    title: {
                        text: 'Time'
                    }
                },
                yAxis: {
                    title: {
                        text: 'Response Time (ms)'
                    }
                },
                series: [{
                    name: '',
                    data: [],
                    color: 'rgba(147, 112, 219, 0.8)',
                    lineWidth: 1.5
                }]
            });
        });

        const handleMessage = (event) => {
            const serverData = JSON.parse(event.data);
            updateChart(serverData.data);
        };

        const updateChart = (serverData) => {
            if (serverData.length > 0) {
                const server = serverData[0];
                if (server.responseTimes) {
                    const responseTimes = server.responseTimes.map(entry => entry.timeDifference !== undefined ? entry.timeDifference : 0);
                    const color = responseTimes.includes(0) ? 'red' : 'rgba(147, 112, 219, 0.8)';
                    const data = responseTimes.map(time => time !== undefined ? time : { y: 0, color: 'red', name: 'Undefined' });
                    chartInstance.series[0].setData(data);
                    chartInstance.series[0].update({ name: server.server, color }, false);
                } else {
                    chartInstance.series[0].setData([{ y: 0, color: 'red', name: 'Undefined' }]);
                    chartInstance.series[0].update({ name: server.server, color: 'red' }, false);
                    const currentTime = new Date();
                    const previousLog = serverLogs.value[serverLogs.value.length - 1];
                    const timeDifference = previousLog ? currentTime.getTime() - previousLog.timestamp.getTime() : 0;
                    serverLogs.value.push({ id: Date.now(), timestamp: currentTime, formattedTimestamp: formatDate(currentTime), server: server.server, timeDifference: timeDifference });
                }
            } else {
                // No hay datos disponibles, establecer la serie como vacía
                chartInstance.series[0].setData([]);
            }
        };

        const calculateAverageResponseTime = () => {
            if (serverLogs.value.length === 0) return 0;

            const sum = serverLogs.value.reduce((total, log) => total + log.timeDifference, 0);
            return sum / serverLogs.value.length;
        };

        const formatDate = (date) => {
            return date.toLocaleString('en-US', { timeZone: 'America/Bogota' });
        };

        const socket = new WebSocket(config.baseURL);

        socket.onopen = () => {
            console.log("WebSocket connection established");
        };

        socket.onerror = (error) => {
            console.error("WebSocket connection error:", error);
        };

        socket.onmessage = handleMessage;

        return { chartContainer, serverLogs, calculateAverageResponseTime };
    }
};
</script>

<style scoped>
.container {
    display: flex;
}

.chart-container {
    padding: 1%;
    width: 70%;
    height: 350px;
    margin: 10px;
}

.logs-container {
    width: 30%;
    max-height: 300px;
    overflow-y: auto;
    padding-left: 10px;
    background-color: #ffffff;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    padding: 3%;
}

.logs {
    list-style-type: none;
    margin: 0;
    padding: 0;
}

.logs li {
    margin-bottom: 5px;
    color: rgb(242, 133, 133);
    font-size: 10px;
    list-style-type: disc;
}

p{
    font-size: 13px;
}
</style>
