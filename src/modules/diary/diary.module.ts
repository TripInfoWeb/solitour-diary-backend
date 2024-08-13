import { Module } from '@nestjs/common';
import { DiaryController } from './diary.controller';
import { DiaryService } from './diary.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Diary } from 'src/entities/diary.entity';
import { User } from 'src/entities/user.entity';
import { DiaryDay } from 'src/entities/diary-day.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Diary, DiaryDay])],
  controllers: [DiaryController],
  providers: [DiaryService],
})
export class DiaryModule {}
