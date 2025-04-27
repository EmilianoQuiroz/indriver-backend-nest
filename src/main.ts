import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({forbidUnknownValues: false}));
  const host = process.env.HOST || '192.168.1.242';
  await app.listen(3000, host);
}
bootstrap();
