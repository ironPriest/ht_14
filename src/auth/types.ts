import { IsString } from 'class-validator';

export class SignInDto {
  @IsString()
  loginOrEmail: string;

  @IsString()
  password: string;
}
