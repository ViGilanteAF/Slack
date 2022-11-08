import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChannelChats } from 'src/entities/ChannelChats';
import { ChannelMembers } from 'src/entities/ChannelMembers';
import { Channels } from 'src/entities/Channels';
import { Users } from 'src/entities/Users';
import { Workspaces } from 'src/entities/Workspaces';
import { EventsModule } from 'src/events/events.module';
import { ChannelsController } from './channels.controller';
import { ChannelsService } from './channels.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Channels,
      ChannelMembers,
      ChannelChats,
      Users,
      Workspaces,
    ]),
    /**EventsModule 를 넣게 된다면 EventsModule.ts 파일 내에 EventsGateway 가 있기때문에 new 를
     * 한번만 하니 결과적으로 서버가 한번만 새로 생기게 되는 현상이 됨 */
    EventsModule,
  ],
  controllers: [ChannelsController],
  /**EventsGate 를 넣게 된다면 다른곳에서 사용할때마다 new 를 하게되며, 이경우 WebSocket 서버가 요청시마다
   * 새로 생기는 현상이 생김 그래서 다수의 WebSocket 서버가 만들어지는 현상이 발생함 */
  providers: [ChannelsService],
})
export class ChannelsModule {}
