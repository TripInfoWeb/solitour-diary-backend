import { Injectable } from '@nestjs/common';
import { CreateDiaryDto, UpdateDiaryDto } from './diary.dto';
import { Diary } from 'src/entities/diary.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { DiaryDay } from 'src/entities/diary-day.entity';
import { User } from 'src/entities/user.entity';
import * as sanitizeHtml from 'sanitize-html';

@Injectable() // 의존성 주입을 위한 데코레이터
export class DiaryService {
  // Repository 주입
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Diary) private diaryRepository: Repository<Diary>,
    @InjectRepository(DiaryDay)
    private diaryDayRepository: Repository<DiaryDay>,
  ) {}

  /**
   * 일기 작성
   * @param diaryDto 일기 데이터
   * @returns 등록된 일기 id 값
   */
  async createDiary(diaryDto: CreateDiaryDto) {
    const user = await this.userRepository.findOne({
      where: { id: diaryDto.userId },
    });

    // 일기 정보 등록
    const diary = new Diary();
    diary.user = user;
    diary.title = diaryDto.title;
    diary.startDate = diaryDto.startDate;
    diary.endDate = diaryDto.endDate;
    diary.address = diaryDto.address;
    const newDiary = await this.diaryRepository.save(diary);

    // 일기 day 정보 배열 생성
    const diaryDays = diaryDto.diaryDays.map((value, index) => {
      const diaryDay = new DiaryDay();
      diaryDay.diary = newDiary;
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
  async getDiary(diaryId: number) {
    const diary = await this.diaryRepository.findOneOrFail({
      where: { id: diaryId },
    });
    const diaryDays = await this.diaryDayRepository.find({
      where: { diary: { id: diary.id } },
    });

    return {
      diaryId: diaryId,
      title: diary.title,
      startDate: diary.startDate,
      endDate: diary.endDate,
      address: diary.address,
      diaryDays: Array.from({ length: diaryDays.length }, (_, index) => ({
        moodLevel: diaryDays[index].moodLevel,
        content: diaryDays[index].content,
      })),
    };
  }

  /**
   * 일기 목록 조회
   */
  async getDiaryList(userId: number) {
    const diaryDayList = await this.diaryDayRepository.find({
      where: { diary: { user: { id: userId } } },
      relations: ['diary'],
    });

    const data = new Map<
      number,
      {
        diaryId: number;
        image: string;
        title: string;
        startDate: Date;
        endDate: Date;
        address: string;
        diaryDays: { moodLevel: number; content: string }[];
      }
    >();

    diaryDayList.forEach((diaryDay) => {
      if (!data.has(diaryDay.diary.id)) {
        data.set(diaryDay.diary.id, {
          diaryId: diaryDay.diary.id,
          image:
            'http://localhost:4000/uploads/images/diary/02fe78e4-cb92-4ccf-958a-137682e93d2b.jpg',
          title: diaryDay.diary.title,
          startDate: diaryDay.diary.startDate,
          endDate: diaryDay.diary.endDate,
          address: diaryDay.diary.address,
          diaryDays: [],
        });
      }

      data.get(diaryDay.diary.id).diaryDays.push({
        moodLevel: diaryDay.moodLevel,
        content: sanitizeHtml(diaryDay.content, { allowedTags: [] }),
      });
    });

    return [...data.values()];
  }

  /**
   * 일기 수정
   */
  async updateDiary(diaryId: number, diaryDto: UpdateDiaryDto) {
    // 일기 정보 수정
    await this.diaryRepository.update(
      { id: diaryId },
      {
        title: diaryDto.title,
        startDate: diaryDto.startDate,
        endDate: diaryDto.endDate,
        address: diaryDto.address,
      },
    );

    // 기존 일기 day 정보 삭제
    await this.diaryDayRepository.delete({ diary: { id: diaryId } });

    const diary = await this.diaryRepository.findOneOrFail({
      where: { id: diaryId },
    });

    // 새로운 일기 day 정보 생성
    const diaryDays = diaryDto.diaryDays.map((value, index) => {
      const diaryDay = new DiaryDay();
      diaryDay.diary = diary;
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

    return diaryId;
  }

  /**
   * 일기 삭제
   * @param diaryId 일기 id 값
   */
  async deleteDiary(diaryId: number) {
    await this.diaryDayRepository.delete({ diary: { id: diaryId } });
    await this.diaryRepository.delete({ id: diaryId });
  }
}
