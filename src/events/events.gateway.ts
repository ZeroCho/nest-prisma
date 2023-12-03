import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { onlineMap } from './onlineMap';
import {MessagesService} from "../apis/messages/messages.service";
import {CreateMessageDto} from "../apis/messages/dto/create-message.dto";

@WebSocketGateway({ namespace: 'messages', transports: ['websocket'] })
export class EventsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() public server: Server;

  constructor(
    private messageService: MessagesService,
  ) {}

  @SubscribeMessage('test')
  handleTest(@MessageBody() data: string) {
    console.log('test', data);
  }

  @SubscribeMessage('sendMessage')
  async sendMessage(@MessageBody() data: CreateMessageDto, @ConnectedSocket() socket: Socket) {
    console.log('test', data);
    const message = await this.messageService.create(data);
    const ids = [data.senderId, data.receiverId];
    ids.sort();
    const receiverSocketId = onlineMap[data.receiverId];
    if (receiverSocketId) {
      socket.to(receiverSocketId).emit('receiveMessage', message);
    }
  }

  @SubscribeMessage('login')
  handleLogin(
    @MessageBody() data: { id: number },
    @ConnectedSocket() socket: Socket,
  ) {
    console.log('websocket login', data.id);
    onlineMap[data.id] = socket.id;
  }

  afterInit(server: Server): any {
    console.log('init');
  }

  handleConnection(@ConnectedSocket() socket: Socket) {
    console.log('connected', socket.nsp.name);
  }

  handleDisconnect(@ConnectedSocket() socket: Socket) {
    console.log('disconnected', socket.nsp.name);
  }
}
