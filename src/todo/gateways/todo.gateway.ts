import { UnauthorizedException } from '@nestjs/common';
import { OnGatewayConnection, OnGatewayDisconnect, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { AuthService } from '../../auth/services/auth.service';
import { UsersService } from '../../users/services/users.service';
import { UserI } from '../../users/user.interface';
import { ConnectionService } from '../services/connection.service';
import { TodoService } from '../services/todo.service';

@WebSocketGateway({ namespace: 'todos', cors: {origin: ['http://localhost:3000', 'http://localhost:4200']}})
export class TodoGateway implements OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer()
  server: Server

  constructor(
    private userService: UsersService,
    private authService: AuthService,
    private connectionService: ConnectionService,
    private todoService: TodoService
  ) {}


  async handleDisconnect(socket: Socket) {
    await this.connectionService.deleteBySocket(socket.id)
    socket.disconnect()
  }

  async handleConnection(socket: Socket) {
    try {
      console.log(socket.handshake.auth.Authorization)
      // hacemos uso de nuestro servicio para verificar la autenticacion del token usando la informacion del socket
      const decodedToken = await this.authService.verifyJwt(socket.handshake.auth.Authorization);
      // si el token es valido obtendremos un usuario que buscaremos en nuestra bd
      const user: UserI = await this.userService.getOneById(decodedToken.user.id)

      if(!user) {
        console.log('Usuario no autorizado desconectado');
        this.disconnect(socket)
      } 
      else {
        console.log(`Usuario ${user.username} verificado`);

        await this.connectionService.create({socketId: socket.id, connectedUser: user});

        const todos = await this.todoService.findAll()

        return this.server.to(socket.id).emit('todos', todos)
      }
      
    } catch {
      console.log('Usuario no autorizado desconectado');
      this.disconnect(socket)
    }

      
  }

  private disconnect(socket: Socket) {
    socket.emit('Error', new UnauthorizedException());
    socket.disconnect
  }
  
}
