import { Injectable } from '@nestjs/common';
import { CreateDiaryDto } from './diary.dto';
import { Diary } from 'src/entities/diary.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { DiaryDay } from 'src/entities/diary-day.entity';

@Injectable() // 의존성 주입을 위한 데코레이터
export class DiaryService {
  // Repository 주입
  constructor(
    @InjectRepository(Diary) private diaryRepository: Repository<Diary>,
    @InjectRepository(DiaryDay)
    private diaryDayRepository: Repository<DiaryDay>,
  ) {}

  /**
   * 일기 작성
   * @param diaryDto 일기 데이터
   */
  async createDiary(diaryDto: CreateDiaryDto) {
    // 일기 정보 등록
    const diary = new Diary();
    diary.userId = diaryDto.userId;
    diary.title = diaryDto.title;
    diary.startDate = diaryDto.startDate;
    diary.endDate = diaryDto.endDate;
    diary.address = diaryDto.address;
    const newDiary = await this.diaryRepository.save(diary);

    // 일기 day 정보 배열 생성
    const diaryDays = diaryDto.diaryDays.map((value, index) => {
      const diaryDay = new DiaryDay();
      diaryDay.diaryId = newDiary.id;
      diaryDay.day = index + 1;
      diaryDay.moodLevel = value.moodLevel;
      diaryDay.content = value.content;
      return diaryDay;
    });

    // bulk insert
    await this.diaryDayRepository
      .createQueryBuilder()
      .insert()
      .into(DiaryDay)
      .values(diaryDays)
      .execute();

    return newDiary.id;
  }

  /**
   * 일기 상세 조회
   */
  async getDiary(id: number) {
    return await this.diaryRepository.findOneOrFail({ where: { id } });
  }

  /**
   * 일기 목록 조회
   */
  getDiaryList() {
    // TODO
  }

  /**
   * 일기 수정
   */
  updateDiary() {
    // TODO
  }

  /**
   * 일기 삭제
   */
  deleteDiary() {
    // TODO
  }
}
