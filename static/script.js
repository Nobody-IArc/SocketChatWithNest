const socket = io('http://localhost:3000/chat');  // 네임스페이스 등록
const nickname = prompt('Type your nickname');

socket.on('connect', () => {
  console.log('connected');
});

function sendMessage() {
  const message = $('#message').val();
  $('#chat').append(`<div>ME: ${message}</div>`); // 본인이 보낸 메시지 표시
  socket.emit('message', { message, nickname });
}

socket.on('message', message => {
  $('#chat').append(`<div>${message}</div>`);
});