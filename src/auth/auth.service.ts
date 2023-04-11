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
    if (user && user.passwordHash === pass) {
      const { passwordHash, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { userId: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
