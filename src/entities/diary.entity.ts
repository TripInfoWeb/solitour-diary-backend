import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Diary {
  /**
   * id는 primary key이며 자동으로 증가하는 값
   */
  @PrimaryGeneratedColumn({ name: 'id' })
  id?: number;

  /**
   * 일기 작성자 id
   */
  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'user_id' })
  user: User;

  /**
   * 여행일기 제목
   */
  @Column('varchar', { name: 'title' })
  title: string;

  /**
   * 시작 날짜
   */
  @Column('datetime', { name: 'state_date' })
  startDate: Date;

  /**
   * 종료 날짜
   */
  @Column('datetime', { name: 'end_date' })
  endDate: Date;

  /**
   * 장소명
   *
   * Ex. 테라로사 포스코센터점
   */
  @Column('varchar', { name: 'place_name' })
  placeName: string;

  /**
   * 주소명
   *
   * Ex. 서울 강남구
   */
  @Column('varchar', { name: 'address' })
  address: string;

  /**
   * 대표 이미지
   */
  @Column('varchar', { name: 'image' })
  image: string;

  /**
   * 생성 날짜
   */
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  /**
   * 수정 날짜
   */
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  /**
   * 삭제 날짜
   */
  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date | null;
}
