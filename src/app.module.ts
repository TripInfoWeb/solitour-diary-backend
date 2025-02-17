import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DiaryModule } from './modules/diary/diary.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Diary } from './entities/diary.entity';
import { User } from './entities/user.entity';
import { DiaryDay } from './entities/diary-day.entity';
import { ImageModule } from './modules/image/image.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

// 모듈 데코레이터
@Module({
  imports: [
    // ConfigModule 설정
    // 1. 전역 모듈 설정 추가
    // 2. 환경 변수 파일 경로 저장
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true, // 캐시하기, ConfigService의 get() 함수를 사용할 때 캐시에서 먼저 불러오게 되므로 성능상의 이점이 있음.
    }),
    TypeOrmModule.forRoot({
      type: 'mysql', // 사용하고자 하는 데이터베이스 종류
      host: process.env.DB_HOST, // 데이터베이스 호스트
      port: Number(process.env.DB_PORT), // 데이터베이스 포트번호
      username: process.env.DB_USERNAME, // 데이터베이스 사용자 이름
      password: process.env.DB_PASSWORD, // 데이터베이스 비밀번호
      database: process.env.DB_DATABASE, // 사용하고자 하는 데이터베이스 이름
      entities: [User, Diary, DiaryDay], // 사용하고자 하는 entity 또는 entity schema 목록
      synchronize: true,
      logging: false,
      dropSchema: false,
    }),
    // 초기화 함수 실행
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'), // 실제 파일이 있는 디렉토리 경로
      serveRoot: '/uploads/images/diary', // url 뒤에 붙을 경로를 지정
    }),
    DiaryModule,
    ImageModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
