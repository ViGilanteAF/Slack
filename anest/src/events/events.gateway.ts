import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { WebSocketServer } from '@nestjs/websockets/decorators';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ namespace: /\/ws-.+/ })
export class EventsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() public server: Server;

  @SubscribeMessage('message')
  handleMessage(client: any, payload: any): string {
    return 'Hello world!';
  }

  afterInit(server: any): any {}

  handleConnection(client: any, ...args): any {}

  handleDisconnect(client: any): any {}
}
/** namespace(전체 대기실) -> room(게임시작전 대기실)  */
/** namespace -> workspace
 * room -> channel
 * 단위로 Sleat 에서는 변경할꺼임
 * 워크스페이스 이름은  socket.nsp.name 으로 접근이 가능함
 */
