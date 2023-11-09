import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { UsersService } from '../apis/users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private usersService: UsersService) {
    super({
      usernameField: 'id',
      passwordField: 'password',
    });
  }

  async validate(id: string, password: string) {
    console.log(id, password);
    const user = await this.usersService.findOneInner(id);
    if (user) {
      if (user.provider !== 'local') {
        throw new ForbiddenException({
          id: user.id,
          provider: user.provider,
        });
      }
      if (await bcrypt.compare(password, user.password)) {
        return user;
      }
      throw new UnauthorizedException('wrong_password');
    }
    throw new NotFoundException('no_user');
  }
}
