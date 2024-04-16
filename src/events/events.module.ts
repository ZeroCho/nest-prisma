import {Module} from '@nestjs/common';
import {EventsGateway} from './events.gateway';
import {MessagesService} from "../apis/messages/messages.service";

@Module({
  providers: [EventsGateway, MessagesService],
  exports: [EventsGateway],
})
export class EventsModule {
}
