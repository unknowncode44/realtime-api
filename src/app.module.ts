import { MiddlewareConsumer, Module, NestModule, RequestMethod         } from '@nestjs/common';
import { AppController  } from './app.controller';
import { AppService     } from './app.service';
import { ConfigModule  } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { TodoModule } from './todo/todo.module';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthMiddleware } from './auth.middleware';

//

@Module({
  imports: [
    ConfigModule.forRoot({isGlobal: true}),
    TypeOrmModule.forRoot({
     type: 'postgres',
     url: process.env.DATABASE_URL,
     autoLoadEntities: true,
     synchronize: true,
    }),
    AuthModule,
    TodoModule,
    UsersModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
      consumer
      .apply(AuthMiddleware)
      .exclude(
        {
        path: '/api/users',
        method: RequestMethod.POST
        },
        {
          path: '/api/users/login',
          method: RequestMethod.POST
        }
      )
  }
}
