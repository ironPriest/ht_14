import {
  Request,
  Controller,
  HttpCode,
  Post,
  UseGuards,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportLocalAuthGuard } from './guards/passport-local-auth.guard';
import { PassportJwtAuthGuard } from './guards/passport-jwt-auth.guard';
import { UsersQueryRepository } from '../users/repositories/users-query.repository';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    protected usersQueryRepository: UsersQueryRepository,
  ) {}

  /*@Post('login')
  @HttpCode(200)
  signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto.loginOrEmail, signInDto.password);
  }*/

  // using passport guard
  @UseGuards(PassportLocalAuthGuard)
  @Post('login')
  @HttpCode(200)
  async login(@Request() req) {
    //return req.user;
    return this.authService.login(req.user);
  }

  @UseGuards(PassportJwtAuthGuard)
  @Get('me')
  getProfile(@Request() req) {
    //console.log('user in req ==> ', req.user);
    const userId = req.user.userId;
    return this.usersQueryRepository.getAuthorizedUser(userId);
  }
}
