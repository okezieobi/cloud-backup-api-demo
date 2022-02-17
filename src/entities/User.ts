import {
  Entity, PrimaryGeneratedColumn, Column, BeforeUpdate,
  CreateDateColumn, UpdateDateColumn, BeforeInsert,
} from 'typeorm';
import { IsEmail, IsIn, validateOrReject } from 'class-validator';

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

    @CreateDateColumn({ default: new Date() })
      createDate: Date;

    @UpdateDateColumn({ default: new Date() })
      updateDate: Date;

    @BeforeInsert()
    async hashPassword() {
      if (this.password != null) this.password = await bcrypt.hashString(this.password);
    }

    @BeforeInsert()
    @BeforeUpdate()
    async validateFields() {
      return validateOrReject(this);
    }

    async validatePassword(password: string, param: string = 'password') {
      const isValidPassword = await bcrypt.compareString(password, this.password);
      if (!isValidPassword) {
        throw new AppError('Password provided does not match user', 'Authorization', { param, msg: 'Authentication failed, mismatched password' });
      }
    }
}
