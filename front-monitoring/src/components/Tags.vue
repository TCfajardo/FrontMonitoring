<template>
    <div class="server-tags">
        <div class="server-up">
            <h4>Servers Up: {{ upCount }}</h4>
            <p>
                <img src="../assets/flechaup.png" alt="Up Arrow" />
            </p>
        </div>
        <div class="server-down">
            <h4>Servers Down: {{ downCount }}</h4>
            <p>
                <img src="../assets/flechadown.png" alt="Down Arrow" />
            </p>
        </div>
        <div class="total-servers">
            <p>Total Servers: {{ totalServers }}</p>
        </div>
    </div>
</template>

<script>
export default {
    name: 'ServerTags',
    data() {
        return {
            servers: [
                { id: 1, name: 'Server 1', status: 'Up' },
                { id: 2, name: 'Server 2', status: 'Down' },
                { id: 3, name: 'Server 3', status: 'Up' },
            ],
        };
    },
    computed: {
        upCount() {
            return this.servers.filter(server => server.status === 'Up').length;
        },
        downCount() {
            return this.servers.filter(server => server.status === 'Down').length;
        },
        totalServers() {
            return this.servers.length;
        },
    },
};
</script>

<style scoped>
.server-tags {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    max-width: 700px;
    height: 120px;
    margin: 0 auto;
    padding: 5px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    background-color: #fff;
}

.server-up,
.server-down,
.total-servers {
    flex: 1;
    margin-right: 10px;
    text-align: center;
}

.server-up h2,
.server-down h2,
.total-servers h2 {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 10px;
}

.server-up p,
.server-down p {
    font-size: 16px;
    margin-bottom: 0;
}

.server-up img,
.server-down img {
    width: 50px;
    height: 50px;
}

</style>
