import { createApp } from 'vue'
import App from './App.vue'

const app = createApp(App)

app.mount('#app')

const socket = new WebSocket('ws://localhost:4000')

socket.addEventListener('open', () => {
    console.log('Conexión con el servidor backend establecida')
})

socket.addEventListener('message', (event) => {
    const data = JSON.parse(event.data)
    app.servers.push(data)
})