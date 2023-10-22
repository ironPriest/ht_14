import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import request from 'supertest';
import { BlogInputDTO } from '../src/blogs/types';
import { PostInputDTO } from '../src/posts/types';

const properBlogInputDTO: BlogInputDTO = {
  name: 'testName',
  description: 'testDescription',
  websiteUrl: 'testWebsiteUrl',
};
const properPostInputDTO: PostInputDTO = {
  title: 'testTitle',
  shortDescription: 'testShortDescription',
  content: 'testContent',
};

describe('blogs', () => {
  let app: INestApplication;
  let server: any;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.enableCors();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
    server = app.getHttpServer();
  });

  afterAll(async () => {
    await app.close();
  });

  // describe POST => blogs
  //// it delete all data => 204
  //// it get all blogs = 0
  //// it 401
  //// it 400
  //// it 201
  //// it 200 get all blogs = 1
  // describe GET => blogs
  // describe PUT => blogs
  //// it 404
  // describe DELETE => blogs

  describe('POST -> /blogs', () => {
    it('should clear all collections', async () => {
      const responseResult = await request(server).delete('/testing/all-data');
      expect(responseResult.status).toBe(204);
    });

    it('should create blog & return created blog', async () => {
      const createdBlog = await request(server)
        .post('/blogs')
        .send(properBlogInputDTO);

      expect(createdBlog.status).toBe(201);

      const newBlog = createdBlog.body;
      expect(newBlog).toEqual({
        id: expect.any(String),
        name: properBlogInputDTO.name,
        description: properBlogInputDTO.description,
        websiteUrl: properBlogInputDTO.websiteUrl,
        createdAt: expect.any(String),
        isMembership: false,
      });
      expect.setState({ newBlog });
    });

    it('should return one created blog', async () => {
      //const { newBlog } = expect.getState();
      //get all blogs => items.len === 1 && items[0] === newBlog
    });
  });

  describe('POST -> /blogs/:blogId/posts', () => {
    it('should create a post for a specific blog and return this post', async () => {
      const { newBlog } = expect.getState();
      const createdPost = await request(server)
        .post('/blogs/' + newBlog.id + '/posts')
        .send(properPostInputDTO);

      expect(createdPost.status).toBe(201);

      const newPost = createdPost.body;
      expect(newPost).toEqual({
        id: expect.any(String),
        title: properPostInputDTO.title,
        shortDescription: properPostInputDTO.shortDescription,
        content: properPostInputDTO.content,
        blogId: newBlog.id,
        blogName: newBlog.name,
        createdAt: expect.any(String),
        extendedLikesInfo: expect.any(Object),
      });
    });
  });
});
