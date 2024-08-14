import { Injectable } from '@nestjs/common';
import { CreateDiaryDto } from './diary.dto';
import { Diary } from 'src/entities/diary.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { DiaryDay } from 'src/entities/diary-day.entity';
import { User } from 'src/entities/user.entity';

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

    const map = new Map<
      number,
      {
        diaryId: number;
        image: string;
        title: string;
        startDate: Date;
        endDate: Date;
        address: string;
        moodLevels: number[];
        contents: string[];
      }
    >();

    diaryDayList.forEach((diaryDay) => {
      if (!map.has(diaryDay.diary.id)) {
        map.set(diaryDay.diary.id, {
          diaryId: diaryDay.diary.id,
          image:
            'file:///C:/Users/user/%EB%AC%B8%EC%84%9C/vscode/solitour-diary-backend/uploads/02fe78e4-cb92-4ccf-958a-137682e93d2b.jpg',
          title: diaryDay.diary.title,
          startDate: diaryDay.diary.startDate,
          endDate: diaryDay.diary.endDate,
          address: diaryDay.diary.address,
          moodLevels: Array<number>(),
          contents: Array<string>(),
        });
      }

      const diary = map.get(diaryDay.diary.id);
      diary.moodLevels.push(diaryDay.moodLevel);
      diary.contents.push(diaryDay.content);
    });

    return [...map.values()];
  }

  /**
   * 일기 수정
   */
  updateDiary() {
    // TODO
  }

  /**
   * 일기 삭제
   * @param diaryId
   */
  async deleteDiary(diaryId: number) {
    await this.diaryDayRepository.delete({ diary: { id: diaryId } });
    await this.diaryRepository.delete({ id: diaryId });
  }
}
