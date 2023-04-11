import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import passport from 'passport';
import session from 'express-session';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.use(
      session({
        resave: false,
        saveUninitialized: false,
        secret: process.env.COOKIE_SECRET,
        cookie: {
          httpOnly: true,
        },
      }),
    );
    await app.init();
    app.use(passport.initialize());
    app.use(passport.session());
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });
  /** superagent 라이브러리도 있었으나 azios 에 밀려서 supertest 를 다시 만들어서 e2e test 시에 많이 사용된다. */
  /** axios 또한 moxios 가 e2e test 용으로 만들어 져 있다.*/
  it('/users/login (POST)', (done) => {
    return request(app.getHttpServer())
      .post('api/users/login')
      .send({
        email: 'abc@naver.com',
        password: 'nodejsbook1',
      })
      .expect(201, done);
  });
});
