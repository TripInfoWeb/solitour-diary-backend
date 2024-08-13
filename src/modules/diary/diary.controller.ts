import { Controller } from '@nestjs/common';
import { DiaryService } from './diary.service';

@Controller('api/diary')
export class DiaryController {
  constructor(private readonly diaryService: DiaryService) {}
}
