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
export class DoubleConfirmationGuard implements CanActivate {
  constructor(protected usersService: UsersService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const email = request.body.email;

    const user = await this.usersService.getByLoginOrEmail(email);

    if (user.emailConfirmation.isConfirmed === true) {
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
