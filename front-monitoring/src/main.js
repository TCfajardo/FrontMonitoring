import Vue from 'vue';
import App from './App.vue';

Vue.config.productionTip = false;

const socket = new WebSocket('ws://localhost:5000');

socket.onopen = () => {
    console.log('Conexión WebSocket establecida');
};

socket.onerror = (error) => {
    console.error('Error en la conexión WebSocket:', error);
};

new Vue({
  render: h => h(App),
}).$mount('#app');

export default socket;
