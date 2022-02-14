import {
  Entity, PrimaryGeneratedColumn, Column, BeforeUpdate,
  CreateDateColumn, UpdateDateColumn, BeforeInsert,
} from 'typeorm';
import { IsEmail, IsIn, validate } from 'class-validator';

import bcrypt from '../utils/bcrypt';
import AppError from '../errors';

@Entity()
export default class UserEntity {
  constructor(
    id: string,
    email: string,
    name: string,
    password: string,
    createDate: Date = new Date(),
    updateDate: Date = new Date(),
    role: string = 'client',
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

    @Column({ type: 'text' })
    @IsIn(['client', 'admin'])
      role: string;

    @CreateDateColumn()
      createDate: Date;

    @UpdateDateColumn()
      updateDate: Date;

    @BeforeInsert()
    async hashPassword() {
      this.password = await bcrypt.hashString(this.password);
    }

    @BeforeInsert()
    @BeforeUpdate()
    async validateFields() {
      const errors = await validate(this);
      if (errors.length > 0) {
        throw new AppError('Validation failed', 'Validation', { errors });
      }
    }

    async validatePassword(password: string, param: string = 'password') {
      const isValidPassword = await bcrypt.compareString(password, this.password);
      if (!isValidPassword) {
        throw new AppError('Password provided does not match user', 'Authorization', { param, msg: 'Authentication failed, mismatched password' });
      }
    }
}
