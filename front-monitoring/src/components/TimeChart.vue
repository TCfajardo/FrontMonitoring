<template>
    <div class="time-chart" ref="chartContainer"></div>
</template>

<script>
import { ref, onMounted } from 'vue';
import Highcharts from 'highcharts';
import config from '../../config.js';

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
                xAxis: {
                    title: {
                        text: 'Time'
                    }
                },
                yAxis: {
                    title: {
                        text: 'Resp. Times (ms)'
                    }
                },
                series: [{
                    name: 'System Response Times',
                    data: [],
                    color: 'rgba(255, 165, 0, 0.8)',
                    lineWidth: 1.5
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

            const totalResponseTimes = responseTimes.reduce((acc, curr) => acc + curr, 0);
            const averageResponseTime = totalResponseTimes / responseTimes.length;

            if (chartInstance.averageLine) {
                chartInstance.averageLine.destroy();
            }
            chartInstance.averageLine = chartInstance.renderer
                .path(['M', chartInstance.xAxis[0].toPixels(chartInstance.xAxis[0].min), chartInstance.yAxis[0].toPixels(averageResponseTime), 'L', chartInstance.xAxis[0].toPixels(chartInstance.xAxis[0].max), chartInstance.yAxis[0].toPixels(averageResponseTime)])
                .attr({
                    'stroke-width': 1,
                    stroke: 'green',
                    zIndex: 8
                })
                .add();

            if (chartInstance.averageLabel) {
                chartInstance.averageLabel.destroy();
            }
            chartInstance.averageLabel = chartInstance.renderer.label(
                'Average: ' + averageResponseTime.toFixed(2),
                chartInstance.plotLeft + chartInstance.plotWidth / 2,
                chartInstance.yAxis[0].toPixels(averageResponseTime) - 15,
                'rect',
                null,
                null,
                true
            )
            .css({
                color: 'black',
                fontSize: '11px'
            })
            .attr({
                zIndex: 5,
                padding: 2,
                
                'stroke-width': 1,
                'text-anchor': 'middle'
            })
            .add();
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
    width: 70%;
}
</style>
