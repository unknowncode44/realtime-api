import { 
    SubscribeMessage,
    WebSocketGateway,
    OnGatewayInit,
    WebSocketServer,
    OnGatewayConnection,
    OnGatewayDisconnect,
    WsResponse
 } from "@nestjs/websockets";
 import { Logger } from "@nestjs/common";
 import { Socket, Server } from 'socket.io'


 @WebSocketGateway()
 export class SocketEventsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer() server: Server;

    private logger: Logger = new Logger

    constructor(){
        this.logger.log('Gateway Instantiated')
    }

    @SubscribeMessage('msgToServer')
    public handleMessage(client: Socket, payload: any): Promise<WsResponse<any>> {
        
        return new Promise((resolve) => {
            // alguna accion asincrona aqui
            this.server.to(payload.room).emit('msgToClient', payload)
            resolve({event: 'msgToClient', data: payload})
        })
    }

    @SubscribeMessage('joinRoom')
    public joinRoom(client: Socket, room: string): void {
        client.join(room)
        client.emit('joinRoom', room)
    }

    @SubscribeMessage('leaveRoom')
    public leaveRoom(client: Socket, room: string): void {
        client.leave(room)
        client.emit('leaveRoom', room)
    }

    public afterInit(server: Server) {
        return this.logger.log('Init')
    }

    public handleDisconnect(client: Socket) {
        return this.logger.log(`Client disconnected: ${client.id}`)
    }

    public handleConnection(client: Socket) {
        return this.logger.log(`Client connected: ${client.id}`)
    }
 }