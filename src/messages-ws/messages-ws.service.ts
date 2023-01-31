import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';

interface ConnectedClients {
  [id: string]: Socket
}

@Injectable()
export class MessagesWsService {
  
  private connectedClient: ConnectedClients = {}

  registerClient(client: Socket) {
    this.connectedClient[client.id] = client
  }

  removeClient(clientId: string) {
    delete this.connectedClient[clientId]
  }

  getConnectedClients(): string[] {
    return Object.keys(this.connectedClient)
  }
}
