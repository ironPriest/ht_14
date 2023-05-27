import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { UsersService } from '../../users/users.service';
import { Request } from 'express';
import { UsersRepository } from '../../users/repositories/users.repository';

@Injectable()
export class ConfirmationGuard implements CanActivate {
  constructor(
    protected usersService: UsersService,
    protected usersRepository: UsersRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();

    const code = request.body.code;
    const user = await this.usersRepository.getByCode(code);

    if (!user) {
      throw new HttpException(
        {
          message: [{ message: 'no such user', field: 'code' }],
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
