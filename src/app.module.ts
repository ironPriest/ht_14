import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BlogsController } from './blogs/blogs.controller';
import { BlogsService } from './blogs/blogs.service';
import { BlogsRepository } from './blogs/repositories/blogs.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Blog, BlogSchema } from './blogs/blogs-schema';
import { TestingController } from './testing/testing.controller';
import { TestingService } from './testing/testing.service';
import { BlogsQueryRepository } from './blogs/repositories/blogs-query.repository';
import { PostsController } from './posts/posts.controller';
import { PostsService } from './posts/posts.service';
import { PostsRepository } from './posts/repositories/posts.repository';
import { PostsQueryRepository } from './posts/repositories/posts-query.repository';
import { Post, PostSchema } from './posts/posts-schema';
import { UsersController } from './users/users.controller';
import { User, UserSchema } from './users/users-schema';
import { UsersService } from './users/users.service';
import { UsersRepository } from './users/repositories/users.repository';
import { UsersQueryRepository } from './users/repositories/users-query.repository';

const mongoUri = process.env.mongoURI || 'mongodb://0.0.0.0:27017/blog_nest';

@Module({
  imports: [
    MongooseModule.forRoot(mongoUri),
    MongooseModule.forFeature([
      { name: Blog.name, schema: BlogSchema },
      { name: Post.name, schema: PostSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [
    AppController,
    BlogsController,
    TestingController,
    PostsController,
    UsersController,
  ],
  providers: [
    AppService,
    BlogsService,
    BlogsRepository,
    BlogsQueryRepository,
    PostsService,
    PostsRepository,
    PostsQueryRepository,
    TestingService,
    UsersService,
    UsersRepository,
    UsersQueryRepository,
  ],
})
export class AppModule {}
