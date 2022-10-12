import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MiddlewareBuilder } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerMiddleware } from './middlewares/logger.middleware';
import { UsersModule } from './users/users.module';
import { WorkspacesModule } from './workspaces/workspaces.module';
import { ChannelsModule } from './channels/channels.module';
import { DmsModule } from './dms/dms.module';
import { UsersService } from './users/users.service';
import { rootCertificates } from 'tls';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChannelChats } from './entities/ChannelChats';
import { ChannelMembers } from './entities/ChannelMembers';
import { Channels } from './entities/Channels';
import { DMs } from './entities/DMs';
import { Mentions } from './entities/Mentions';
import { Users } from './entities/Users';
import { WorkspaceMembers } from './entities/WorkspaceMembers';
import { Workspaces } from './entities/Workspaces';
import * as ormconfig from '../ormconfig';
import { AuthModule } from './auth/auth.module';

const getData = async () => {
  //뭔짓을 하던 값을 가져와서 return

  return {
    DB_USERNAME: 'cliche',
    DB_PASSWORD: 'nodejsbook',
  };
};

@Module({
  imports: [
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
          synchronize: false, //처음 한번만 True 로 만들어서 테이블 만들어 둔뒤 꼭!! False 로 바꿔서 데이터가 덥어씌워 지지 않도록 하자!
          keepConnectionAlive: true,
          logging: true,
          charset: 'utf8mb4',
          autoLoadEntities: true,
          cli: { migrationDir: 'src/migrations' },
          migrations: [__dirname + '/src/migrations/*.ts'],
        };
      },
    }),
    TypeOrmModule.forFeature([Users]),
  ],
  controllers: [AppController],
  providers: [AppService, UsersService],
  exports: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
