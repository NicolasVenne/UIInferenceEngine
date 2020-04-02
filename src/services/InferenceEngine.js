import openSocket from 'socket.io-client';
const socket = openSocket("http://localhost:8080");
// const socket = openSocket("https://mysterious-refuge-20182.herokuapp.com/");

function ask(msg) {
    socket.emit("ask", msg);
}

function onPrompt(callback) {
    socket.on("prompt", callback);
}

function onReply(callback) {
    socket.on("reply", callback);
}

function onEndConvo(callback) {
    socket.on('endConvo', callback)
}

export { ask, onPrompt, onReply, onEndConvo };