import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { UserDocument } from '../users/users-schema';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    //@Inject(forwardRef(() => UsersService))
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
    if (!user) return null;

    /*if (user && user.passwordHash === pass) {
      const { passwordHash, ...result } = user;
      return result;
    }*/

    const result = await bcrypt.compare(pass, user.passwordHash);
    if (!result) return null;

    return user;
  }

  async login(user: any) {
    //const payload = { userId: user.id };
    const payload = {
      username: user.login,
      sub: user._id.toString(),
    };
    console.log('user in login() ==> ', user);
    console.log('payload in login() ==>', payload);
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  async generateHash(password: string) {
    return bcrypt.hash(password, 10);
  }
}
