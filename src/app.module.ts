import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DiaryModule } from './modules/diary/diary.module';
import { ConfigModule } from '@nestjs/config';

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
    DiaryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
