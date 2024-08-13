import {
  Body,
  Controller,
  Delete,
  HttpCode,
  Param,
  Post,
} from '@nestjs/common';
import { DiaryService } from './diary.service';
import { CreateDiaryDto } from './diary.dto';

@Controller('api/diary')
export class DiaryController {
  constructor(private readonly diaryService: DiaryService) {}

  /**
   * 일기 작성
   * @param diaryDto 일기 데이터
   * @returns 등록된 일기 id 값
   */
  @Post('/create')
  async createDiary(@Body() diaryDto: CreateDiaryDto) {
    return await this.diaryService.createDiary(diaryDto);
  }

  @Delete('delete/:id')
  @HttpCode(204) // No Content
  async deleteDiary(@Param('id') id: number) {
    await this.diaryService.deleteDiary(id);
    return { message: 'No Content' };
  }
}
