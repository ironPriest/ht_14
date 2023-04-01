import { HydratedDocument, Model } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { PostInputDTO, PostUpdateDTO } from './types';

@Schema()
export class LikeStatus {
  @Prop({ required: true })
  userId: string;

  @Prop({ default: 'None' })
  like: string;

  @Prop({ required: true })
  addedAt: string;
}

export const LikeStatusSchema = SchemaFactory.createForClass(LikeStatus);

@Schema()
export class Post {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  shortDescription: string;

  @Prop({ required: true })
  content: string;

  @Prop({ required: true })
  blogId: string;

  @Prop({ required: true })
  blogName: string;

  @Prop({ required: true })
  createdAt: string;

  @Prop({ default: [], type: [LikeStatusSchema] })
  likeStatuses: LikeStatus[];

  static createPost(
    DTO: PostInputDTO,
    blogId: string,
    blogName: string,
    PostModel: PostModelType,
  ): PostDocument {
    const post = new PostModel({
      title: DTO.title,
      shortDescription: DTO.shortDescription,
      content: DTO.content,
      blogId: blogId,
      blogName: blogName,
      createdAt: new Date().toISOString(),
    });
    return post;
  }

  update(DTO: PostUpdateDTO) {
    this.title = DTO.title;
    this.shortDescription = DTO.shortDescription;
    this.content = DTO.content;
    this.blogId = DTO.blogId;
  }
}

export const PostSchema = SchemaFactory.createForClass(Post);

const postStaticMethods: PostModelStaticType = {
  createPost: Post.createPost,
};
PostSchema.statics = postStaticMethods;
PostSchema.methods = { update: Post.prototype.update };

export type PostDocument = HydratedDocument<Post>;
export type PostModelStaticType = {
  createPost: (
    DTO: PostInputDTO,
    blogId: string,
    blogName: string,
    PostModel: PostModelType,
  ) => PostDocument;
};
export type PostModelType = Model<PostDocument> & PostModelStaticType;
