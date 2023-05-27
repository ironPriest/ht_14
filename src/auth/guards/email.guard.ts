import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { UsersService } from '../../users/users.service';
import { Request } from 'express';

@Injectable()
export class EmailGuard implements CanActivate {
  constructor(protected usersService: UsersService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const email = request.body.email;

    const user = await this.usersService.getByLoginOrEmail(email);

    if (!user) {
      throw new HttpException(
        {
          message: [{ message: 'no such email', field: 'email' }],
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    if (user.emailConfirmation.isConfirmed === true) {
      throw new HttpException(
        {
          message: [{ message: 'already confirmed', field: 'email' }],
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    return true;
  }
}
