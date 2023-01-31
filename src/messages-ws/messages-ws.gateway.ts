import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessagesWsService } from './messages-ws.service';
import { NewMessageDto } from './dtos/new-message.dto';

@WebSocketGateway({ cors: true })
export class MessagesWsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  
  @WebSocketServer() wss: Server

  constructor(
    private readonly messagesWsService: MessagesWsService
  ) {}

  handleConnection(client: Socket, ...args: any[]) {
    this.messagesWsService.registerClient(client)
    this.wss.emit('clients-updated', this.messagesWsService.getConnectedClients())
  }
  handleDisconnect(client: Socket) {
    this.messagesWsService.removeClient(client.id)
    this.wss.emit('clients-updated', this.messagesWsService.getConnectedClients())
  }

  @SubscribeMessage('message-from-client')
  handleMessagesFromClient(client: Socket, payload: NewMessageDto) {
    console.log(client.id, payload)
  }
}