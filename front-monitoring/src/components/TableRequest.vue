<template>
    <div class="request-table">
        <h4>Successful responses</h4>
        <table>
            <thead>
                <tr>
                    <th>Método</th>
                    <th>URL</th>
                    <th>Hora</th>
                    <th>Payload</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(request, index) in requests" :key="index">
                    <td>{{ request.method }}</td>
                    <td>{{ request.url }}</td>
                    <td>{{ formatTimestamp(request.timestamp) }}</td>
                    <td>{{ request.payload }}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>

export default {
    name: 'RequestTable',
    props: {
        requests: {
            type: Array,
            required: true
        }
    },
    methods: {
        formatTimestamp(timestamp) {
            const date = new Date(timestamp);
            return date.toLocaleString(); 
        }
    }
};
</script>

<style scoped>
.request-table {
    width: 60%;
    overflow-y: auto;
}

table {
    padding:0%;
    width: 100%;
    border-collapse: collapse;
}

th,
td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: left;
}

th {
    background-color: #f2f2f2;
}
</style>