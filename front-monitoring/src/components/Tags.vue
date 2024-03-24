<template>
    <div class="server-tags">
        <div class="server-up">
            <h4>Servers Up: {{ upCount }}</h4>
            <p>
                <img src="../assets/flechaup.png" alt="Up Arrow" />
            </p>
            <ul v-if="activeServers.length > 0" class="server-list">
                <li v-for="server in activeServers" :key="server.server">{{ server.server }}</li>
            </ul>
            <p v-else>No up servers</p>
        </div>
        <div class="server-down">
            <h4>Servers Down: {{ downCount }}</h4>
            <p>
                <img src="../assets/flechadown.png" alt="Down Arrow" />
            </p>
            <ul v-if="inactiveServers.length > 0" class="server-list">
                <li v-for="server in inactiveServers" :key="server.server">{{ server.server }}</li>
            </ul>
            <p v-else>No down servers</p>
        </div>
        <div class="total-servers">
            <p>Total Servers: {{ totalServers }}</p>
        </div>
    </div>
</template>

<script>
import config from '../../config.js';

export default {
    name: 'ServerTags',
    data() {
        return {
            servers: [],
            upServers: 0,
            downServers: 0,
        };
    },
    computed: {
        upCount() {
            return this.servers.filter(server => server.status === 'Activo').length;
        },
        downCount() {
            return this.servers.filter(server => server.status === 'Inactivo').length;
        },
        totalServers() {
            return this.servers.length;
        },
        activeServers() {
            return this.servers.filter(server => server.status === 'Activo');
        },
        inactiveServers() {
            return this.servers.filter(server => server.status === 'Inactivo');
        },
    },
    methods: {
        handleMessage(event) {
            const serverData = JSON.parse(event.data);
            if (Array.isArray(serverData.data)) {
                this.servers = serverData.data;
                this.countServers();
            } else {
                console.error("Los datos del servidor no son un array:", serverData.data);
            }
        },
        countServers() {
            this.upServers = this.servers.filter(server => server.status === 'Activo').length;
            this.downServers = this.servers.filter(server => server.status === 'Inactivo').length;
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

        socket.onmessage = this.handleMessage;

        this.socket = socket;
    },
    destroyed() {
        if (this.socket) {
            this.socket.close();
        }
    },
};
</script>

<style scoped>
.server-tags {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    max-width: 700px;
    margin: 0 auto;
    padding: 5px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    background-color: #fff;
    margin-bottom: 3%;
}

.server-up,
.server-down,
.total-servers {
    flex: 1;
    margin-right: 10px;
    text-align: center;
}

.server-list {
    list-style-type: none;
    padding: 0;
}

.server-list li {
    margin: 5px 0;
}

.server-up img,
.server-down img {
    width: 50px;
    height: 50px;
}
</style>