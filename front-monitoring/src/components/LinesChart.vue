<template>
    <div class="lines-chart-container" ref="chartContainer"></div>
</template>

<script>
import { ref, onMounted } from 'vue';
import Highcharts from 'highcharts';
import config from '../../config.js';

export default {
    name: 'LinesChart',
    setup() {
        const chartContainer = ref(null);
        let chartInstance = null;

        onMounted(() => {
        
        });

        const handleMessage = (event) => {
            const serverData = JSON.parse(event.data);
            updateChart(serverData.data);
        };

        const updateChart = (serverData) => {
            const seriesOptions = [];

            serverData.forEach(server => {
                const data = [];
                if (server.responseTimes && Array.isArray(server.responseTimes)) {
                    const timeByServer = server.responseTimes.filter(time => time.server === server.server);
                    timeByServer.forEach(time => {
                        if (typeof time.timeDifference === 'undefined') {
                            data.push([time.timestamp, null]);
                        } else {
                            data.push([time.timestamp, time.timeDifference]);
                        }
                    });
                    
                    if (timeByServer.length < server.responseTimes.length) {
                        data.push([timeByServer[timeByServer.length - 1].timestamp, null]);
                    }
                }
                const seriesData = {
                    name: server.server,
                    data: data
                };
                seriesOptions.push(seriesData);
            });

            if (chartInstance) {
                chartInstance.update({
                    series: seriesOptions
                });
            } else {
                chartInstance = Highcharts.chart(chartContainer.value, {
                    // Configuración del gráfico Highcharts
                    title: {
                        text: 'Servers Response Times',
                        align: 'left'
                    },
                    subtitle: {
                        text: 'Monitoring servers backend, ParkingLot',
                        align: 'left'
                    },
                    yAxis: {
                        title: {
                            text: 'Response Times (ms)'
                        }
                    },
                    xAxis: {
                        title: {
                            text: 'Time'
                        },
                        accessibility: {
                            rangeDescription: ''
                        }
                    },
                    legend: {
                        layout: 'vertical',
                        align: 'right',
                        verticalAlign: 'middle'
                    },
                    plotOptions: {
                        series: {
                            label: {
                                connectorAllowed: false
                            },
                            pointStart: 0
                        }
                    },
                    series: seriesOptions,
                    responsive: {
                        rules: [{
                            condition: {
                                maxWidth: 500
                            },
                            chartOptions: {
                                legend: {
                                    layout: 'horizontal',
                                    align: 'center',
                                    verticalAlign: 'bottom'
                                }
                            }
                        }]
                    }
                });
            }
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
.lines-chart-container {
    margin-top: auto;
    width: 85%;
    height: 450px;
}
</style>
