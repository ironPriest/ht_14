import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Post, PostDocument } from '../posts-schema';
import { Model } from 'mongoose';

@Injectable()
export class PostsRepository {
  constructor(@InjectModel(Post.name) private PostModel: Model<PostDocument>) {}

  async save(post: PostDocument) {
    await post.save();
  }

  async getPost(postId: string): Promise<PostDocument> {
    return this.PostModel.findOne().where('_id').equals(postId);
  }

  async delete(postId: string) {
    await this.PostModel.deleteOne().where('_id').equals(postId);
  }

  async deleteAll() {
    await this.PostModel.deleteMany({});
  }
}
