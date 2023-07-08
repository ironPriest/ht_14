import { IsNotEmpty, IsUrl, Length } from 'class-validator';
import { Transform, TransformFnParams } from 'class-transformer';

export class BlogInputDTO {
  @IsNotEmpty()
  @Length(1, 15)
  @Transform(({ value }: TransformFnParams) => value?.trim())
  name: string;

  @IsNotEmpty()
  @IsUrl()
  @Length(1, 100)
  websiteUrl: string;

  @IsNotEmpty()
  @Length(1, 500)
  description: string;
}

export class BlogUpdateDTO {
  constructor(
    public name: string,
    public description: string,
    public websiteUrl: string,
  ) {}
}

export class BlogViewDTO {
  constructor(
    public id: string,
    public name: string,
    public websiteUrl: string,
    public description: string,
    public createdAt: string,
    public isMembership: boolean,
  ) {}
}
