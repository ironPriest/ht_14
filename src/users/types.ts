import { IsEmail, Length } from 'class-validator';

export class UserInputDTO {
  @Length(3, 10)
  login: string;

  @Length(6, 20)
  password: string;

  @IsEmail()
  email: string;
}

export class ResendingDTO {
  @IsEmail()
  email: string;
}

export class HashedPasswordDTO {
  login: string;
  email: string;
}

export class UserViewDTO {
  constructor(
    public id: string,
    public login: string,
    public email: string,
    public createdAt: string,
  ) {}
}

export class AuthorizedUserViewDTO {
  constructor(
    public userId: string,
    public login: string,
    public email: string,
  ) {}
}
