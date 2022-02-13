import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, UpdateDateColumn, BeforeInsert,
} from 'typeorm';
import { IsEmail, IsIn } from 'class-validator';

import bcrypt from '../utils/bcrypt';

@Entity()
export default class UserModel {
    @PrimaryGeneratedColumn('uuid')
      id!: string;

    @Column({ unique: true })
    @IsEmail()
      email!: string;

    @Column()
      password!: string;

    @Column()
    @IsIn(['client', 'admin'])
      role!: string;

    @CreateDateColumn()
      createDate!: Date;

    @UpdateDateColumn()
      updateDate!: Date;

    @BeforeInsert()
    async hashPassword() {
      this.password = await bcrypt.hashString(this.password);
    }
}
