import {Module} from '@nestjs/common';
import {EventsGateway} from './events.gateway';
import {MessagesService} from "../apis/messages/messages.service";
import {CustomPrismaModule} from "nestjs-prisma";
import {extendedPrismaClient} from "../prisma.extension";

@Module({
  imports: [CustomPrismaModule.forRootAsync({
    name: 'PrismaService',
    useFactory: () => {
      return extendedPrismaClient;
    },
  })],
  providers: [EventsGateway, MessagesService,],
  exports: [EventsGateway],
})
export class EventsModule {
}
