import { IsEmail, IsString } from 'class-validator';

export class SignInDto {
  @IsString()
  loginOrEmail: string;

  @IsString()
  password: string;
}

export class RegistrationDto {
  @IsString()
  login: string;

  @IsString()
  password: string;

  @IsEmail()
  email: string;
}
