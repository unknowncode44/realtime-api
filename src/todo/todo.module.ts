import { Module } from '@nestjs/common';
import { TodoGateway } from './gateways/todo.gateway';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [AuthModule, UsersModule],
  providers: [TodoGateway]
})
export class TodoModule {}
