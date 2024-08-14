import {
  IsArray,
  IsDateString,
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

  @IsDateString()
  startDate: Date;

  @IsDateString()
  endDate: Date;

  @IsString()
  @Length(1)
  placeName: string;

  @IsString()
  @Length(1)
  address: string;

  @IsString()
  @Length(1)
  image: string;

  @IsArray()
  diaryDays: {
    moodLevel: number;
    content: string;
  }[];
}

/**
 * 여행일기 수정 시 사용할 DTO
 */
export class UpdateDiaryDto {
  @IsString()
  @Length(1)
  title: string;

  @IsDateString()
  startDate: Date;

  @IsDateString()
  endDate: Date;

  @IsString()
  @Length(1)
  placeName: string;

  @IsString()
  @Length(1)
  address: string;

  @IsArray()
  diaryDays: {
    moodLevel: number;
    content: string;
  }[];
}
