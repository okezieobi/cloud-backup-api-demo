import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, UpdateDateColumn, BeforeInsert,
} from 'typeorm';
import { IsEmail, IsIn } from 'class-validator';

import bcrypt from '../utils/bcrypt';
import AppError from '../error';

@Entity()
export default class UserEntity {
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

    async validatePassword(password: string, param: string = 'password') {
      const isValidPassword = await bcrypt.compareString(password, this.password);
      if (!isValidPassword) {
        throw new AppError('Password provided does not match user', 'Authorization', { param, msg: 'Authentication failed, mismatched password' });
      }
    }
}
