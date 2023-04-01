import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsQueryRepository } from './repositories/posts-query.repository';
import { PostInputDTO, PostUpdateDTO } from './types';
import { BlogsQueryRepository } from '../blogs/repositories/blogs-query.repository';

@Controller('posts')
export class PostsController {
  constructor(
    protected postsService: PostsService,
    protected postsQueryRepository: PostsQueryRepository,
    protected blogsQueryRepository: BlogsQueryRepository,
  ) {}

  @Get(':id')
  async getPost(@Param('id') postId: string) {
    const post = await this.postsQueryRepository.getPost(postId);
    if (!post) throw new NotFoundException();
    console.log(' == getPost == ');
    return post;
  }

  @Post()
  async createPost(
    @Body() inputDTO: PostInputDTO,
    @Body('blogId') blogId: string,
  ) {
    const blog = await this.blogsQueryRepository.getBlog(blogId);
    const postId = await this.postsService.create(inputDTO, blogId, blog.name);
    return this.postsQueryRepository.getPost(postId);
  }

  @Put(':id')
  @HttpCode(204)
  async updatePost(
    @Param('id') postId: string,
    @Body() updateDTO: PostUpdateDTO,
  ) {
    const post = await this.postsQueryRepository.getPost(postId);
    if (!post) throw new NotFoundException();

    await this.postsService.update(postId, updateDTO);
  }

  @Delete(':id')
  @HttpCode(204)
  async delete(@Param('id') postId: string) {
    console.log(' == deletePost == ');
    const post = await this.postsQueryRepository.getPost(postId);
    if (!post) throw new NotFoundException();

    await this.postsService.delete(postId);
  }

  @Get()
  async getPosts(
    @Query()
    query: {
      pageNumber: string;
      pageSize: string;
      sortBy: string;
      sortDirection: string;
    },
  ) {
    //todo -> optimize
    const pageNumber = query.pageNumber ? +query.pageNumber : 1;
    const pageSize = query.pageSize ? +query.pageSize : 10;
    const sortBy = query.sortBy ? query.sortBy.toString() : 'createdAt';
    const sortDirection = query.sortDirection
      ? query.sortDirection.toString()
      : 'desc';
    return this.postsQueryRepository.getPosts(
      null,
      pageNumber,
      pageSize,
      sortBy,
      sortDirection,
    );
  }
}
