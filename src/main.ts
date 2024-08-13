import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ConfigService를 app.get()에 추가
  const configService = app.get(ConfigService);

  // 전역 파이프에 validationPipe 객체 추가
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(configService.get('SERVER_PORT'));
}
bootstrap();
