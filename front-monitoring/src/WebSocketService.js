import WebSocket from 'ws';

const socket = new WebSocket('ws://localhost:4000'); // Reemplaza localhost y el puerto con la dirección de tu servidor de monitoreo

socket.onopen = () => {
    console.log('Conexión WebSocket establecida');
};

socket.onerror = (error) => {
    console.error('Error en la conexión WebSocket:', error);
};

socket.onmessage = (event) => {
    console.log('Mensaje recibido desde el servidor:', event.data);
    // Maneja los mensajes recibidos desde el servidor
};

const sendWebSocketMessage = (message) => {
    socket.send(message);
};

export { sendWebSocketMessage };
