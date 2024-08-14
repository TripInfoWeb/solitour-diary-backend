import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Diary } from './diary.entity';

@Entity()
export class DiaryDay {
  /**
   * id는 primary key이며 자동으로 증가하는 값
   */
  @PrimaryGeneratedColumn({ name: 'id' })
  id?: number;

  /**
   * 여행일기 id
   */
  @ManyToOne(() => Diary, (diary) => diary.id)
  @JoinColumn({ name: 'diary_id' })
  diary: Diary;

  /**
   * N일차
   */
  @Column('int', { name: 'day' })
  day: number;

  /**
   * 기분
   */
  @Column('int', { name: 'mood_level' })
  moodLevel: number;

  /**
   * 일기 내용
   */
  @Column('text', { name: 'content' })
  content: string;
}
