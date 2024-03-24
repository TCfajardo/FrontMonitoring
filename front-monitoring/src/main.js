import Vue from 'vue';
import App from './App.vue';
import config from '../config';

Vue.config.productionTip = false;

const socket = new WebSocket(config.baseURL);

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
