import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { UserDocument } from '../users/users-schema';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(loginOrEmail: string, pass: string): Promise<any> {
    const user: UserDocument = await this.usersService.getByLoginOrEmail(
      loginOrEmail,
    );
    /*if (user?.passwordHash !== pass) {
      throw new UnauthorizedException();
    }*/
    if (!user) throw new UnauthorizedException();

    const payload = { userId: user.id };
    return { accessToken: await this.jwtService.signAsync(payload) };
  }

  async validateUser(loginOrEmail: string, pass: string): Promise<any> {
    const user = await this.usersService.getByLoginOrEmail(loginOrEmail);
    console.log('user in validateUser() ==> ', user);
    if (user && user.passwordHash === pass) {
      const { passwordHash, ...result } = user;
      console.log('result in validateUser ==> ', result);
      return result;
    }
    return null;
  }

  async login(user: any) {
    //const payload = { userId: user.id };
    const payload = {
      username: user._doc.login,
      sub: user._doc._id.toString(),
    };
    console.log('user in login() ==> ', user);
    console.log('payload in login() ==>', payload);
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
