import {
  IsArray,
  IsDate,
  IsInt,
  IsPositive,
  IsString,
  Length,
} from 'class-validator';

/**
 * 여행일기 등록 시 사용할 DTO
 */
export class CreateDiaryDto {
  @IsInt()
  @IsPositive()
  userId: number;

  @IsString()
  @Length(1)
  title: string;

  @IsDate()
  startDate: Date;

  @IsDate()
  endDate: Date;

  @IsString()
  @Length(1)
  address: string;

  @IsArray()
  diaryDays: {
    moodLevel: number;
    content: string;
  }[];
}