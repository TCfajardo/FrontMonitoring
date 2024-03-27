<template>
    <div class="response-container">
        <h3>Response Time</h3>
        <div class="table-container">
            <table>
                <thead>
                    <tr>
                        <th class="table-header">Servers</th>
                        <th class="table-header">Status</th>
                        <th class="table-header">Response Time (ms)</th>
                        <th class="table-header">Time-out</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(servidor, index) in servidores" :key="index">
                        <td>{{ servidor.nombre }}</td>
                        <td>{{ servidor.status }}</td>
                        <td>{{ servidor.timeDifferences ? servidor.timeDifferences.join(', ') : 'N/A' }}</td>
                        <td>{{ servidor.sinRespuesta ? servidor.fechaHora : 'No' }}</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <h3>Successful Response Logs</h3>
        <div class="log-container">
            <ul>
                <li v-for="(log, index) in respuestaExitosaLogs" :key="index" :class="{ 'log-success': log.includes('successful response') }">{{ log }}</li>
            </ul>
        </div>
        <h3>Unresponsive Servers Logs</h3>
        <div class="log-container">
            <ul>
                <li v-for="(log, index) in sinRespuestaLogs" :key="index" :class="{ 'log-error': log.includes('no response') }">{{ log }}</li>
            </ul>
        </div>
    </div>
</template>

<script>
import config from '../../config.js';

export default {
    name: 'TablaServidores',
    data() {
        return {
            servidores: [],
            sinRespuestaLogs: [],
            respuestaExitosaLogs: []
        };
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
    },
    methods: {
        handleMessage(event) {
            const data = JSON.parse(event.data);
            if (data.type === 'healthCheck') {
                this.actualizarServidores(data.data);
            }
        },
        actualizarServidores(data) {
            this.servidores = data.map(servidor => {
                const status = servidor.status;
                const timeDifferences = servidor.responseTimes ? servidor.responseTimes.filter(entry => entry.server === servidor.server).map(entry => entry.timeDifference) : [];
                const sinRespuesta = !servidor.responseTimes || servidor.responseTimes.some(entry => entry.timeDifference === undefined);
                const fechaHora = new Date().toLocaleString();

                if (sinRespuesta) {
                    this.sinRespuestaLogs.push(`${fechaHora}, server ${servidor.server} no response.`);
                } else {
                    this.respuestaExitosaLogs.push(`${fechaHora}, server ${servidor.server} successful response.`);
                }

                return {
                    nombre: servidor.server,
                    status: status,
                    timeDifferences: timeDifferences,
                    sinRespuesta: sinRespuesta,
                    fechaHora: sinRespuesta ? fechaHora : ''
                };
            });
        }
    }
};
</script>

<style scoped>
.response-container {
    width: 85%;
    overflow: auto;
    padding: 20px;
}

.table-container {
    height: 300px;
    overflow: auto;
}

.log-container {
    max-height: 180px;
    overflow: auto;
}

table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 20px;
    background-color: #ffffff;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

th,
td {
    border: 1px solid #ddd;
    padding: 12px;
    text-align: left;
    font-size: 12px; 
}

.table-header {
    background-color: rgb(243, 191, 94);
    font-weight: bold;
    font-size: 14px;
    color: #ffffff;
}

ul {
    padding-left: 20px;
}

li {
    margin-bottom: 8px;
    font-size: 13px;
}

.log-error {
    color: red;
}

.log-success {
    color: green;
}

h2 {
    margin-top: 20px;
    font-size: 15px;
    color: #333333;
}
</style>
