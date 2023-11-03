import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly allowedEmails: string[]) {}
  canActivate(
    context: ExecutionContext,
  ): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (user && user.email && this.allowedEmails.includes(user.email)) {
      return true;
    }

    return false;
  }
}
