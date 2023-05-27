import {
  BadRequestException,
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
  UseGuards,
} from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { BlogInputDTO, BlogUpdateDTO } from './types';
import { BlogsQueryRepository } from './repositories/blogs-query.repository';
import { PostsService } from '../posts/posts.service';
import { PostInputDTO } from '../posts/types';
import { PostsQueryRepository } from '../posts/repositories/posts-query.repository';
import { BasicAuthGuard } from '../auth/guards/basic-auth.guard';

@Controller('blogs')
export class BlogsController {
  constructor(
    protected blogsService: BlogsService,
    protected blogsQueryRepository: BlogsQueryRepository,
    protected postsService: PostsService,
    protected postsQueryRepository: PostsQueryRepository,
  ) {}

  @UseGuards(BasicAuthGuard)
  @Post()
  async createBlog(@Body() inputDTO: BlogInputDTO) {
    const blogId: string = await this.blogsService.create(inputDTO);
    const blog = await this.blogsQueryRepository.getBlog(blogId);
    if (!blog) throw new BadRequestException();
    return blog;
  }

  @Post(':blogId/posts')
  async createPost(
    @Param('blogId') blogId: string,
    @Body() inputDTO: PostInputDTO,
  ) {
    const blog = await this.blogsQueryRepository.getBlog(blogId);
    if (!blog) throw new NotFoundException();
    const postId: string = await this.postsService.create(
      inputDTO,
      blog.id,
      blog.name,
    );
    return this.postsQueryRepository.getPost(postId);
  }

  @Get()
  getBlogs(
    @Query()
    query: {
      searchNameTerm: string;
      sortBy: string;
      sortDirection: string;
      pageNumber: string;
      pageSize: string;
    },
  ) {
    let searchNameTerm = null;
    if (query.searchNameTerm) {
      searchNameTerm = query.searchNameTerm;
    }
    const pageNumber = query.pageNumber ? +query.pageNumber : 1;
    const pageSize = query.pageSize ? +query.pageSize : 10;
    const sortBy = query.sortBy ? query.sortBy.toString() : 'createdAt';
    const sortDirection = query.sortDirection
      ? query.sortDirection.toString()
      : 'desc';
    return this.blogsQueryRepository.getBlogs(
      searchNameTerm,
      pageNumber,
      pageSize,
      sortBy,
      sortDirection,
    );
  }

  @Get(':id')
  async getBlog(@Param('id') blogId: string) {
    const blog = await this.blogsQueryRepository.getBlog(blogId);
    if (!blog) throw new NotFoundException();

    return blog;
  }

  @Get(':blogId/posts')
  async getPosts(
    @Param('blogId') blogId: string,
    @Query()
    query: {
      pageNumber: string;
      pageSize: string;
      sortBy: string;
      sortDirection: string;
    },
  ) {
    //todo -> is it a proper 404 check?
    const blog = await this.blogsQueryRepository.getBlog(blogId);
    if (!blog) throw new NotFoundException();
    //todo -> optimize
    const pageNumber = query.pageNumber ? +query.pageNumber : 1;
    const pageSize = query.pageSize ? +query.pageSize : 10;
    const sortBy = query.sortBy ? query.sortBy.toString() : 'createdAt';
    const sortDirection = query.sortDirection
      ? query.sortDirection.toString()
      : 'desc';
    return this.postsQueryRepository.getPosts(
      blogId,
      pageNumber,
      pageSize,
      sortBy,
      sortDirection,
    );
  }

  @UseGuards(BasicAuthGuard)
  @Put(':id')
  @HttpCode(204)
  async updateBlog(
    @Param('id') blogId: string,
    @Body() updateDTO: BlogUpdateDTO,
  ) {
    const blog = await this.blogsQueryRepository.getBlog(blogId);
    if (!blog) throw new NotFoundException();

    await this.blogsService.update(blogId, updateDTO);
  }

  @UseGuards(BasicAuthGuard)
  @Delete(':id')
  @HttpCode(204)
  async delete(@Param('id') blogId: string) {
    const blog = await this.blogsQueryRepository.getBlog(blogId);
    if (!blog) throw new NotFoundException();

    await this.blogsService.delete(blogId);
  }
}
