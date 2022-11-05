import { PickType } from '@nestjs/swagger';
import { ChannelChats } from 'src/entities/ChannelChats';

export class PostChatDto extends PickType(ChannelChats, ['content']) {}
