import {Module} from '@nestjs/common';
import {LocalSerializer} from './local.serializer';
import {LocalStrategy} from './local.strategy';
import {PassportModule} from '@nestjs/passport';
import {UsersService} from '../apis/users/users.service';

@Module({
  imports: [
    PassportModule.register({ session: true }),
  ],
  providers: [LocalSerializer, LocalStrategy, UsersService],
})
export class AuthModule {}
