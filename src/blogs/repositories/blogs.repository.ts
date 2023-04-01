import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Blog, BlogDocument } from '../blogs-schema';
import { Model } from 'mongoose';

@Injectable()
export class BlogsRepository {
  constructor(@InjectModel(Blog.name) private BlogModel: Model<BlogDocument>) {}

  async getBlogs(): Promise<any> {
    return this.BlogModel.find();
  }

  async save(blog: BlogDocument) {
    await blog.save();
  }

  async deleteAll() {
    await this.BlogModel.deleteMany({});
  }

  async getBlog(blogId: string): Promise<BlogDocument> {
    return this.BlogModel.findOne().where('_id').equals(blogId);
  }

  async delete(blogId: string) {
    await this.BlogModel.deleteOne().where('_id').equals(blogId);
  }
}
