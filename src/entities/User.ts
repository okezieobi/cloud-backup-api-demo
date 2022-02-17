import {
  Entity, Column, BeforeInsert,
} from 'typeorm';
import { IsEmail, IsIn } from 'class-validator';

import AppEntity from './Base';
import bcrypt from '../utils/bcrypt';
import AppError from '../errors';

@Entity()
export default class UserEntity extends AppEntity {
  constructor(
    id: string,
    email: string,
    name: string,
    password: string,
    createdAt: Date = new Date(),
    updatedAt: Date = new Date(),
    role: string = 'client',
  ) {
    super(id, createdAt, updatedAt);
    this.email = email;
    this.name = name;
    this.role = role;
    this.password = password;
  }

    @Column({ unique: true, type: 'text', nullable: false })
    @IsEmail()
      email: string;

    @Column({ nullable: false, type: 'text' })
      name: string;

    @Column({ nullable: false, type: 'text' })
      password: string;

    @Column({ type: 'text', default: 'client' })
    @IsIn(['client', 'admin'])
      role: string;

    @BeforeInsert()
    async hashPassword() {
      if (this.password != null) this.password = await bcrypt.hashString(this.password);
    }

    async validatePassword(password: string, param: string = 'password') {
      const isValidPassword = await bcrypt.compareString(password, this.password);
      if (!isValidPassword) {
        throw new AppError('Password provided does not match user', 'Authorization', { param, msg: 'Authentication failed, mismatched password' });
      }
    }
}
