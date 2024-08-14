import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { DiaryService } from './diary.service';
import { CreateDiaryDto, UpdateDiaryDto } from './diary.dto';
import { AuthGuard } from '../auth/auth.guard';

@Controller('api/diary')
export class DiaryController {
  constructor(private readonly diaryService: DiaryService) {}

  /**
   * 일기 작성
   * @param diaryDto 일기 데이터
   * @returns 등록된 일기 id 값
   */
  @UseGuards(AuthGuard)
  @Post('/create')
  async createDiary(@Body() diaryDto: CreateDiaryDto) {
    const id = await this.diaryService.createDiary(diaryDto);
    return { id: id };
  }

  /**
   * 일기 상세 조회
   * @param id 일기 id 값
   * @returns 일기 데이터
   */
  @UseGuards(AuthGuard)
  @Get('/:id')
  async getDiary(@Param('id') id: number) {
    // TODO: 접근 권한

    return await this.diaryService.getDiary(id);
  }

  /**
   * 일기 목록 조회
   * @returns 일기 목록
   */
  @UseGuards(AuthGuard)
  @Get()
  async getDiaryList() {
    // TODO: 접근 권한
    // TODO: 유저 id 값 구하기
    return await this.diaryService.getDiaryList(1);
  }

  /**
   * 일기 수정
   * @param id 일기 id 값
   * @returns No Content
   */
  @UseGuards(AuthGuard)
  @Put('/update/:id')
  async updateDiary(@Param('id') id: number, @Body() diaryDto: UpdateDiaryDto) {
    const diaryId = await this.diaryService.updateDiary(id, diaryDto);
    return { id: diaryId };
  }

  /**
   * 일기 삭제
   * @param id 일기 id 값
   * @returns No Content
   */
  @UseGuards(AuthGuard)
  @Delete('/delete/:id')
  @HttpCode(204) // No Content
  async deleteDiary(@Param('id') id: number) {
    await this.diaryService.deleteDiary(id);
    return { message: 'No Content' };
  }
}
