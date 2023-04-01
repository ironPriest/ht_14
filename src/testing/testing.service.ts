import { BlogsRepository } from '../blogs/repositories/blogs.repository';
import { Injectable } from '@nestjs/common';
import { PostsRepository } from '../posts/repositories/posts.repository';
import { UsersRepository } from '../users/repositories/users.repository';

@Injectable()
export class TestingService {
  constructor(
    protected blogsRepository: BlogsRepository,
    protected postsRepository: PostsRepository,
    protected usersRepository: UsersRepository,
  ) {}

  async deleteAll() {
    await this.blogsRepository.deleteAll();
    await this.postsRepository.deleteAll();
    await this.usersRepository.deleteAll();
  }
}
