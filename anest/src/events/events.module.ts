import { Module } from '@nestjs/common';
import { EventsGateway } from './events.gateway';

@Module({
  providers: [EventsGateway],
  /** Module 를 inport 했는데 그안에 있는 providers 를 사용하고 싶을 경우 exports 로 빼주어야 사용이 가능하다 */
  exports: [EventsGateway],
})
export class EventsModule {}
