import { IsEmail, IsString } from 'class-validator';

interface LoginParams {
    email: string;
    password: string;
}

export default class LoginValidator implements LoginParams {
    @IsEmail()
      email: string;

    @IsString()
      password: string;

    constructor(email: string, password: string) {
      this.email = email;
      this.password = password;
    }
}

export { LoginParams };
