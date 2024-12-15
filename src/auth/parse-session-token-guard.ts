import {CanActivate, ExecutionContext, Injectable} from '@nestjs/common';

@Injectable()
export class ParseSessionTokenGuard implements CanActivate {
  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { decode } = await import("next-auth/jwt");
    const nextToken = request.cookies['authjs.session-token'];
    console.log(nextToken);
    if (nextToken) {
      const decoded = await decode({
        token: nextToken,
        secret: process.env.AUTH_SECRET,
        salt: "authjs.session-token",
      });
      console.log(decoded);
      request.user = {
        ...decoded,
        id: decoded.email,
      };
    }
    return true;
  }
}
