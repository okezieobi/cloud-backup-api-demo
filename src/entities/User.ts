import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, UpdateDateColumn, BeforeInsert,
} from 'typeorm';
import { IsEmail, IsIn } from 'class-validator';

import bcrypt from '../utils/bcrypt';
import AppError from '../errors';

@Entity()
export default class UserEntity {
  constructor(
    id: string,
    email: string,
    name: string,
    role: string,
    password: string,
    createDate: Date,
    updateDate: Date,
  ) {
    this.id = id;
    this.email = email;
    this.name = name;
    this.role = role;
    this.password = password;
    this.createDate = createDate;
    this.updateDate = updateDate;
  }

    @PrimaryGeneratedColumn('uuid')
      id: string;

    @Column({ unique: true, type: 'text' })
    @IsEmail()
      email: string;

    @Column('text')
      name: string;

    @Column('text')
      password: string;

  @Column({ default: 'client', type: 'text' })
    @IsIn(['client', 'admin'])
    role: string;

    @CreateDateColumn({ default: new Date() })
      createDate: Date;

    @UpdateDateColumn({ default: new Date() })
      updateDate: Date;

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
