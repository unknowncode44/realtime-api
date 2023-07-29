import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { RedisIoAdapter } from './adapters/redis.adapter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors()
  
  app.setGlobalPrefix('api');
  //const redisIoAdapter = new RedisIoAdapter(app)
  //await redisIoAdapter.connectToRedis();
  //app.useWebSocketAdapter(redisIoAdapter)
  await app.listen(3044);
}
bootstrap();
