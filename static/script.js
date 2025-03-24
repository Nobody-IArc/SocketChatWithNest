const socket = io('http://localhost:3000/chat');  // 네임스페이스 등록
const nickname = prompt('Type your nickname');
const roomSocket = io('http://localhost:3000/room');

let currentRoom = ''; // 초기화

socket.on('connect', () => {
  console.log('connected');
});

// 메시지 전송
function sendMessage() {
  if (currentRoom === '') {
    return alert('Invalid room');
  }
  const message = $('#message').val();
  const data = { message, nickname, room: currentRoom };

  // html 파일에 추가할 것
  $('#chat').append(`<div>ME : ${message}</div>`);
  // emit 메서드 사용
  roomSocket.emit('message', data);
  return false;
}

socket.on('message', message => {
  $('#chat').append(`<div>${message}</div>`);
});

socket.on('notice', data => {
  $('#notice').append(`<div>${data.message}</div>`);
});


// 방 생성
function createRoom() {
  const room = prompt('Type new Rooms name');
  roomSocket.emit('createRoom', { room, nickname });
}

roomSocket.on('message', data => {
  console.log(data);
  $('#chat').append(`<div>${data.message}</div>`);
});

roomSocket.on('room-list', data => {
  console.log(data);
  $('#room-list').empty();
  data.forEach((room) => {
    $('#room-list').append(`<li>${room} <button onclick="joinRoom('${room}')">join</button></li>`);
  });
});

// 방 입장
function joinRoom(room) {
  roomSocket.emit('joinRoom', { room, nickname, toLeaveRoom: currentRoom });
  $('#chat').html('');  // 다른 방으로 이동 시 기존 대화 삭제
  currentRoom = room;
}
