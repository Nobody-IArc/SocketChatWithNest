import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ namespace: 'chat' }) // 네임스페이스로 분리
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  // 메시지 전송
  @SubscribeMessage('message')
  handleMessage(socket: Socket, data: any): void {
    const { message, nickname } = data;
    socket.broadcast.emit('message', `${nickname} : ${message}`);
  }
}

@WebSocketGateway({ namespace: 'room' }) // room namespace
export class RoomGateway {
  constructor(private chatGateway: ChatGateway) {}
  rooms: any[] = [];

  @WebSocketServer() // 서버 인스턴스 접근 변수
  server: Server;

  // 방 생성
  @SubscribeMessage('createRoom') // createRoom 핸들러 메서드
  handleMessage(@MessageBody() data: any) {
    // ^ Socket 없이 데이터만
    const { nickname, room } = data;
    this.chatGateway.server.emit('notice', {
      message: `${nickname} create ${room}`,
    });
    this.rooms.push(room); // room 정보 추가
    this.server.emit('room-list', this.rooms); // room-list 전송
  }

  // 방 입장 시 알림
  @SubscribeMessage('joinRoom')
  async handleJoinRoom(socket: Socket, data: any): Promise<void> {
    const { nickname, room, toLeaveRoom } = data;
    await socket.leave(toLeaveRoom);
    this.chatGateway.server.emit('notice', {
      message: `${nickname} is joined ${room}`,
    });
    await socket.join(room);
  }

  // 방에서 메시지를 전송하는 기능
  @SubscribeMessage('message')
  handleMessageToRoom(socket: Socket, data: any) {
    const { nickname, room, message } = data;
    console.log(data);
    socket.broadcast.emit('message', {
      message: `${nickname} : ${message}`,
    });
  }
}
