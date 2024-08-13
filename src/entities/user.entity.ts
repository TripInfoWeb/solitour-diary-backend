import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  /**
   * id는 primary key이며 자동으로 증가하는 값
   */
  @PrimaryGeneratedColumn({ name: 'id' })
  id?: number;

  /**
   * 사용자 이름
   */
  @Column('varchar', { name: 'name' })
  name: string;
}
