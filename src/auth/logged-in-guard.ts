import {CanActivate, ExecutionContext, Injectable} from '@nestjs/common';

@Injectable()
export class LoggedInGuard implements CanActivate {
  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    console.log('canActivate with req.user', request.user?.id && request.isAuthenticated());
    const { decode } = await import("next-auth/jwt");
    if (request.user?.id && request.isAuthenticated()) {
      return request.user?.id && request.isAuthenticated();
    }
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
      if (decoded && new Date(decoded.exp * 1000) > new Date()) {
        return true;
      }
    }
    return false;
  }
}
