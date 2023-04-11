![maxresdefault](https://user-images.githubusercontent.com/40601526/231259094-47c47501-c295-404b-aa87-a209a5adcade.jpg)
# Slack

> Slack is Clone coding with Slack Service
- Visite my [Project History](https://stronghu95.notion.site/Slack-Clone-c4af61614beb4d06ad64a57f5e744b28) to view history.
- Use Nest.js and MySQL

# Purpose
- Use Node.js build Backend 
- Use Restful API run Server

# Environment
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![NestJS](https://img.shields.io/badge/nestjs-%23E0234E.svg?style=for-the-badge&logo=nestjs&logoColor=white)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![MySQL](https://img.shields.io/badge/mysql-%2300f.svg?style=for-the-badge&logo=mysql&logoColor=white)

# Description
- Use Nest.js build Slack Service Backend.
- Build Live Chatting Service.
- Channel Service as Slack.
- It work Direct Message Service.
- Channel leader Service

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
# [ERD](https://www.erdcloud.com/p/3jCm3eFKdvKSRLJYt)
![Slack](https://user-images.githubusercontent.com/40601526/231259342-4f945a09-c023-4719-9fe6-17874da731a2.png)

# Function & Logic
>Login & API Service & SignUp
## [Login](https://github.com/ViGilanteAF/Slack/blob/main/src/app.module.ts)
~~~javascript

    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    UsersModule,
    WorkspacesModule,
    DmsModule,
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (ConfigService: ConfigService) => {
        return {
          type: 'mysql',
          host: 'localhost',
          port: 3306,
          username: ConfigService.get('DB_USERNAME'),
          password: ConfigService.get('DB_PASSWORD'),
          database: ConfigService.get('DB_DATABASE'),
          entities: [
            ChannelChats,
            ChannelMembers,
            Channels,
            DMs,
            Mentions,
            Users,
            WorkspaceMembers,
            Workspaces,
          ],
          synchronize: false, /

          keepConnectionAlive: true,
          logging: true,
          charset: 'utf8mb4',
          autoLoadEntities: true,
          cli: { migrationDir: 'src/migrations' },
          migrations: [__dirname + '/src/migrations/*.ts'],
        };
      },
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      autoLoadEntities: true,
      keepConnectionAlive: true,
      migrations: [__dirname + '/migrations/*.ts'],
      charset: 'utf8mb4',
      synchronize: false,
      logging: true,
    }),
    TypeOrmModule.forFeature([Users]),
    EventsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
  exports: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
~~~
## [API Swagger Service](https://github.com/ViGilanteAF/Slack/blob/main/src/main.ts)
~~~javascript
const config = new DocumentBuilder()
    .setTitle('Slact API')
    .setDescription('API Document for Slact.')
    .setVersion('1.0')
    .addCookieAuth('connect.sid')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
~~~
## [SignUp](https://github.com/ViGilanteAF/Slack/blob/main/src/users/users.controller.ts)
~~~javascript
@UseGuards(NotLoggedInGuard)
  @ApiOperation({ summary: '회원가입' })
  @Post()
  async join(@Body() body: JoinRequestDto) {
    //@Body => express 의 body Pasrer 와 같은것 Dto = Data Transport Object
    await this.usersService.join(body.email, body.nickname, body.password);
  }
~~~

# Unit Test & E2E Testing
## [Unit testing](https://github.com/ViGilanteAF/Slack/blob/main/src/users/users.service.spec.ts)
~~~javascript
it('should be defined', () => {
    expect(service).toBeDefined();
  });
  /**나중에 할 테스트는 it.todo 으로 하고
   * 바로 해야할 테스트는 it  으로 한다.
   */
  it('findByEmail은 Email을 통해 유저를 찾아야 함', () => {
    expect(service.findByEmail('abc@naver.com')).resolves.toStrictEqual({
      email: 'abc@naver.com',
      id: 1,
    });
  });

  it.todo('findByEmail은 유저를 찾지 못하면 null을 반환해야함!', () => {
    expect(service.findByEmail('abc@naver.com')).resolves.toBe(null);
  });
});
~~~
## [E2E testing](https://github.com/ViGilanteAF/Slack/blob/main/test/app.e2e-spec.ts)
~~~javascript
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
~~~

---

# Development to do....
* Use Nest.js to build Slack service from Express.js.
* Make more `Module` system.
* Use less await. Decrease memory usage.
* `QueryBuilder` is wonderful DB query.
* [More](https://stronghu95.notion.site/10cf545a0edf4be3a4e411185420bc18)
