import { Request, Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './types';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  /*@Post('login')
  @HttpCode(200)
  signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto.loginOrEmail, signInDto.password);
  }*/

  // using passport guard
  @UseGuards(AuthGuard('local'))
  @Post('login')
  @HttpCode(200)
  async login(@Request() req) {
    //return req.user;
    return this.authService.login(req.user);
  }
}
