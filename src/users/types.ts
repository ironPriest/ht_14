export class UserInputDTO {
  constructor(
    public login: string,
    public password: string,
    public email: string,
  ) {}
}

export class UserViewDTO {
  constructor(
    public id: string,
    public login: string,
    public email: string,
    public createdAt: string,
  ) {}
}
