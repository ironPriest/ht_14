import { IsUrl, Length } from 'class-validator';

export class BlogInputDTO {
  @Length(1, 15)
  name: string;

  @IsUrl()
  @Length(1, 100)
  websiteUrl: string;

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
