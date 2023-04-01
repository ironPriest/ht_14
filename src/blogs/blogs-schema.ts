import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';
import { BlogInputDTO, BlogUpdateDTO } from './types';

@Schema()
export class Blog {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  websiteUrl: string;

  @Prop({ required: true })
  createdAt: string;

  @Prop({ default: false })
  isMembership: boolean;

  static createBlog(DTO: BlogInputDTO, BlogModel: BlogModelType): BlogDocument {
    const blog = new BlogModel({
      name: DTO.name,
      description: DTO.description,
      websiteUrl: DTO.websiteUrl,
      createdAt: new Date().toISOString(),
    });
    return blog;
  }

  update(DTO: BlogUpdateDTO) {
    this.name = DTO.name;
    this.description = DTO.description;
    this.websiteUrl = DTO.websiteUrl;
  }
}

export const BlogSchema = SchemaFactory.createForClass(Blog);

const blogStaticMethods: BlogModelStaticType = {
  createBlog: Blog.createBlog,
};
BlogSchema.statics = blogStaticMethods;
BlogSchema.methods = { update: Blog.prototype.update };

export type BlogDocument = HydratedDocument<Blog>;
export type BlogModelStaticType = {
  createBlog: (DTO: BlogInputDTO, BlogModel: BlogModelType) => BlogDocument;
};
export type BlogModelType = Model<BlogDocument> & BlogModelStaticType;
