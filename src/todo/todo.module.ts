import { Module } from '@nestjs/common';
import { TodoGateway } from './gateways/todo.gateway';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConnectionEntity } from './entities/connection.entity';
import { Todo } from './entities/todo.entity';
import { TodoService } from './services/todo.service';
import { ConnectionService } from './services/connection.service';
import { SetupService } from './services/setup.service';

@Module({
  imports: [
    AuthModule, 
    UsersModule,
    TypeOrmModule.forFeature([ConnectionEntity, Todo])
  ],
  providers: [
    TodoGateway,
    TodoService,
    ConnectionService,
    SetupService 
  ]
})
export class TodoModule {}
