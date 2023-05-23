import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Request } from 'express';
import { UsersService } from '../../users/users.service';

@Injectable()
export class DoubleEmailLoginGuard implements CanActivate {
  constructor(protected usersService: UsersService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const login = request.body.login;
    const email = request.body.email;
    const userByLogin = await this.usersService.getByLoginOrEmail(login);
    const userByEmail = await this.usersService.getByLoginOrEmail(email);

    if (userByLogin) {
      throw new HttpException(
        {
          message: [
            { message: 'login or email already in use', field: 'login' },
          ],
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    if (userByEmail) {
      throw new HttpException(
        {
          message: [
            { message: 'login or email already in use', field: 'email' },
          ],
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    return true;
  }
}
