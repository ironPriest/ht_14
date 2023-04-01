import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Post, PostModelType } from './posts-schema';
import { PostsRepository } from './repositories/posts.repository';
import { PostInputDTO, PostUpdateDTO } from './types';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name) private PostModel: PostModelType,
    protected postsRepository: PostsRepository,
  ) {}

  async create(
    DTO: PostInputDTO,
    blogId: string,
    blogName: string,
  ): Promise<string> {
    const post = this.PostModel.createPost(
      DTO,
      blogId,
      blogName,
      this.PostModel,
    );
    await this.postsRepository.save(post);
    return post._id.toString();
  }

  async update(postId: string, DTO: PostUpdateDTO) {
    const post = await this.postsRepository.getPost(postId);
    post.update(DTO);
    await this.postsRepository.save(post);
  }

  async delete(postId: string) {
    await this.postsRepository.delete(postId);
  }
}
