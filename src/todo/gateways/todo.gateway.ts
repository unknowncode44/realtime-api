import { UnauthorizedException } from '@nestjs/common';
import { OnGatewayConnection, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { AuthService } from '../../auth/services/auth.service';
import { UsersService } from '../../users/services/users.service';
import { UserI } from '../../users/user.interface';

@WebSocketGateway({ namespace: 'todos', cors: {origin: ['http://localhost:3000', 'http://localhost:4200']}})
export class TodoGateway implements OnGatewayConnection {

  @WebSocketServer()
  server: Server

  constructor(
    private userService: UsersService,
    private authService: AuthService
  ) {}

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
        console.log(`Usuario ${user.username} verificado`)
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
