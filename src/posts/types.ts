export enum like {
  'Like',
  'Dislike',
  'None',
}

export class PostInputDTO {
  constructor(
    public title: string,
    public shortDescription: string,
    public content: string,
  ) {}
}

export class PostUpdateDTO {
  constructor(
    public title: string,
    public shortDescription: string,
    public content: string,
    public blogId: string,
  ) {}
}

export class PostViewDTO {
  constructor(
    public id: string,
    public title: string,
    public shortDescription: string,
    public content: string,
    public blogId: string,
    public blogName: string,
    public createdAt: string,
    public extendedLikesInfo: {
      likesCount: number;
      dislikesCount: number;
      myStatus: string;
      newestLikes: [];
    },
  ) {}
}
