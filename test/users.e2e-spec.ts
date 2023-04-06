import {
  BadRequestException,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import * as request from 'supertest';
import { HttpExceptionFilter } from '../src/exception.filter';

describe('users', () => {
  let app: INestApplication;
  let server: any;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.enableCors();
    app.useGlobalPipes(
      new ValidationPipe({
        stopAtFirstError: true,
        exceptionFactory: (errors) => {
          const errorsForResponse = [];

          errors.forEach((e) => {
            const constrainKeys = Object.keys(e.constraints);
            constrainKeys.forEach((cKey) => {
              errorsForResponse.push({
                message: e.constraints[cKey],
                field: e.property,
              });
            });
          });
          throw new BadRequestException(errorsForResponse);
        },
      }),
    );
    app.useGlobalFilters(new HttpExceptionFilter());
    await app.init();
    server = app.getHttpServer();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST -> /posts', () => {
    it('should clear all collections', async () => {
      const responseResult = await request(server).delete('/testing/all-data');
      expect(responseResult.status).toBe(204);
    });

    it('should throw -auth- error', async () => {
      const testResponse = await request(server).post('/users').send({
        login: 'testLogin',
        password: 'testPassword',
        email: 'mail@mail.com',
      });
      expect(testResponse.status).toBe(401);
    });

    it('should throw -short login- error', async () => {
      const testResponse = await request(server)
        .post('/users')
        .set({ Authorization: 'Basic YWRtaW46cXdlcnR5' })
        .send({
          login: 'sl',
          password: 'testPassword',
          email: 'mail@mail.com',
        });
      expect(testResponse.status).toBe(400);

      const errorBody = testResponse.body;
      expect(errorBody).toEqual({
        errorsMessages: expect.arrayContaining([
          {
            message: 'login must be longer than or equal to 3 characters',
            field: 'login',
          },
        ]),
      });
    });

    it('should throw -long login- error', async () => {
      const testResponse = await request(server)
        .post('/users')
        .set({ Authorization: 'Basic YWRtaW46cXdlcnR5' })
        .send({
          login: 'longTestLogin',
          password: 'testPassword',
          email: 'mail@mail.com',
        });
      expect(testResponse.status).toBe(400);

      const errorBody = testResponse.body;
      expect(errorBody).toEqual({
        errorsMessages: expect.arrayContaining([
          {
            message: 'login must be shorter than or equal to 10 characters',
            field: 'login',
          },
        ]),
      });
    });

    it('should throw -short password- error', async () => {
      const testResponse = await request(server)
        .post('/users')
        .set({ Authorization: 'Basic YWRtaW46cXdlcnR5' })
        .send({
          login: 'testLogin',
          password: 'short',
          email: 'mail@mail.com',
        });
      expect(testResponse.status).toBe(400);

      const errorBody = testResponse.body;
      expect(errorBody).toEqual({
        errorsMessages: expect.arrayContaining([
          {
            message: 'password must be longer than or equal to 6 characters',
            field: 'password',
          },
        ]),
      });
    });

    it('should throw -long password- error', async () => {
      const testResponse = await request(server)
        .post('/users')
        .set({ Authorization: 'Basic YWRtaW46cXdlcnR5' })
        .send({
          login: 'testLogin',
          password: 'longPasswordLongPassword',
          email: 'mail@mail.com',
        });
      expect(testResponse.status).toBe(400);

      const errorBody = testResponse.body;
      expect(errorBody).toEqual({
        errorsMessages: expect.arrayContaining([
          {
            message: 'password must be shorter than or equal to 20 characters',
            field: 'password',
          },
        ]),
      });
    });

    it('should throw -email- error', async () => {
      const testResponse = await request(server)
        .post('/users')
        .set({ Authorization: 'Basic YWRtaW46cXdlcnR5' })
        .send({
          login: 'testLogin',
          password: 'testPassword',
          email: 'incorrect',
        });
      expect(testResponse.status).toBe(400);

      const errorBody = testResponse.body;
      expect(errorBody).toEqual({
        errorsMessages: expect.arrayContaining([
          {
            message: 'email must be an email',
            field: 'email',
          },
        ]),
      });
    });
  });
});
