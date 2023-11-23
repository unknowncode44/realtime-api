import { UnauthorizedException  } from '@nestjs/common';
import {  OnGatewayConnection, 
          OnGatewayDisconnect, 
          SubscribeMessage, 
          WebSocketGateway, 
          WebSocketServer       } from '@nestjs/websockets';
import { Socket, Server         } from 'socket.io';
import { DeleteResult           } from 'typeorm';

// own imports
import { AuthService            } from '../../auth/services/auth.service';
import { UsersService           } from '../../users/services/users.service';
import { UserI                  } from '../../users/user.interface';
import { ConnectionService      } from '../services/connection.service';
import { TodoService            } from '../services/todo.service';
import { ConnectionI, TodoItem  } from '../todo.interface';

@WebSocketGateway(
  { 
    namespace: 'todos', 
    cors: 
    {
      // definimos los origenes de los clientes
      origin: 
      [ 
        //desarrollo
        'http://localhost:3000', 
        'http://localhost:4200',
        
        //produccion
        'https://realtime.hvdevs.com',
        'https://api.realtime.hvdevs.com'
      ]
    }
  }
)
export class TodoGateway implements OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer()
  server: Server

  constructor(
    private userService       : UsersService,       //<-- Servicio de usuarios
    private authService       : AuthService,        //<-- Servicio de autenticacion
    private connectionService : ConnectionService,  //<-- Servicio de conexiones
    private todoService       : TodoService         //<-- Servicio de tareas
  ) {}

  // mannejamos las desconexiones desde aca
  async handleDisconnect(socket: Socket) {
    socket.disconnect()
  }

  // manejamos las conexiones al servidor socket y verificamos la autenticidad del usuario
  async handleConnection(socket: Socket) {
    try {
      
      // hacemos uso de nuestro servicio para verificar la autenticacion del token usando la informacion del socket
      const decodedToken = await this.authService.verifyJwt(socket.handshake.auth.Authorization);
      // si el token es valido obtendremos un usuario que buscaremos en nuestra bd
      const user: UserI = await this.userService.getOneById(decodedToken.user.id)

      if(!user) {
        // si el usuario no cuenta con un token valido ni existe en la base de datos
        // lo desconectamos y mandamos un mensaje por consola
        console.log('Usuario no autorizado desconectado');
        this.disconnect(socket)
      } 
      else {
        // si el usuario existe y cuenta con un token valiodo, enviamos un mensaje por consola
        console.info(`Usuario ${user.username} verificado`);

        // creamos un registro de conexion
        await this.connectionService.create({socketId: socket.id, connectedUser: user});

        // buscamos todos los todos y emitimos un mensaje al cliente conectado
        const todos = await this.todoService.findAll()
        return this.server.to(socket.id).emit('todos', todos)
      }
      
    } catch {
      // si hay errores desconectamos 
      console.info('Usuario no autorizado desconectado');
      this.disconnect(socket)
    }  
  }

  // manejamos la desconexion cuando los usuarios no estan autenticados
  private disconnect(socket: Socket) {
    socket.emit('Error', new UnauthorizedException());
    socket.disconnect
  }


  //////////////////////////////////////////////////
  //                    EVENTOS                   // 
  //////////////////////////////////////////////////


  // nos suscribimos del lado del servidor para agregar nuevas tareas
  @SubscribeMessage('addTodo')
  async onAddTodo(socket: Socket, todoItem: TodoItem){

    
    // guardar la nueva tarea en la base de datos
    const createdTodoItem: TodoItem = await this.todoService.save(todoItem);
    
    // creamos un log de consola
    console.info('Nuevo Tarea Agregada', todoItem)
    
    // publicar la nueva tarea a todos los usuarios conectados
    const connections: ConnectionI[] = await this.connectionService.findAll()
    for (let i = 0; i < connections.length; i++) {
      const e = connections[i];
      this.server.to(e.socketId).emit('addedTodo', createdTodoItem);
    }   
  }

  // nos suscribimos del lado del servidor para actualizar tareas
  @SubscribeMessage('updateTodo')
  async updateTodo(socket: Socket, todoItem: TodoItem) {
    
    // actualizar la tarea en la base de datos
    const updatedTodo: TodoItem = await this.todoService.update(todoItem)
    console.info(`Tarea Actualizada con ID: ${updatedTodo.id}, nuevo status: ${updatedTodo.status}`)

     // publicar los cambios a todos los usuarios conectados
     const connections: ConnectionI[] = await this.connectionService.findAll()
     for (let i = 0; i < connections.length; i++) {
       const e = connections[i];
       this.server.to(e.socketId).emit('updatedTodo', updatedTodo);
     }
  }

  // nos suscribimos del lado del servidor al evento para borrar tareas
  @SubscribeMessage('deleteTodo')
  async deleteTodo(socket: Socket, todoItem: TodoItem) {
    // borrar la tarea de la base de datos
    const deleteResult: DeleteResult = await this.todoService.delete(todoItem)
    console.info(`Tarea con ID ${todoItem.id} eliminada con resultado n\ ${deleteResult.affected}`)

    // publicar la eliminacion todos los usuarios conectados
    const connections: ConnectionI[] = await this.connectionService.findAll()
    for (let i = 0; i < connections.length; i++) {
      const e = connections[i];
      this.server.to(e.socketId).emit('deletedTodo', deleteResult);
    }
  }
}
