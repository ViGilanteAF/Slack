import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  ConnectedSocket,
  WebSocketServer,
  MessageBody,
} from '@nestjs/websockets';

import dataSource from 'dataSource';
import { Server, Socket } from 'socket.io';
/** Nest는 export 를 한파일에 하나만 있는것을 권장하기 때문에 다수의 Export 를 하는것은 Nest에서 권장하는 방식도 아님
 * 따라서 export 로 바로 만들어 줄 수 있으나 좀더 구조적으로 만들고 권장사항을 따르기 위해 별도의 .ts 파일로 만들어 분리함
 */
import { onlineMap } from './onlineMap';

@WebSocketGateway({ namespace: /\/ws-.+/ })
export class EventsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() public server: Server;

  @SubscribeMessage('test')
  handleTest(@MessageBody() data: string) {
    console.log('test', data);
  }

  @SubscribeMessage('login')
  handleLogin(
    @MessageBody() data: { id: number; channels: number[] }, //의존성 주입
    @ConnectedSocket() socket: Socket,
  ) {
    const newNamespace = socket.nsp;
    console.log('login', newNamespace);
    onlineMap[socket.nsp.name][socket.id] = data.id;
    newNamespace.emit('onlineList', Object.values(onlineMap[socket.nsp.name]));
    data.channels.forEach((channel) => {
      console.log('join', socket.nsp.name, channel);
      socket.join(`${socket.nsp.name}-${channel}`);
    });
  }

  afterInit(server: Server): any {
    console.log('Websocket Server init');
  }

  handleConnection(@ConnectedSocket() socket: Socket): any {
    console.log('connected', socket.nsp.name);
    if (!onlineMap[socket.nsp.name]) {
      onlineMap[socket.nsp.name] = {};
    }
    /**broadcast to all clients in the given sub-namespace */
    /** Socket.io 와 같은 emit 를 해주면 되나 on 의 경우는 다름! */
    socket.emit('hello', socket.nsp.name);
  }

  handleDisconnect(@ConnectedSocket() socket: Socket): any {
    console.log('disconnected', socket.nsp.name);
    const newNamespace = socket.nsp;
    delete onlineMap[socket.nsp.name][socket.id];
    newNamespace.emit('onlineList', Object.values(onlineMap[socket.nsp.name]));
  }
}
/** namespace(전체 대기실) -> room(게임시작전 대기실)  */
/** namespace -> workspace
 * room -> channel
 * 단위로 Sleat 에서는 변경할꺼임
 * 워크스페이스 이름은  socket.nsp.name 으로 접근이 가능함
 */
