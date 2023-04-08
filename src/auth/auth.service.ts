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
}
