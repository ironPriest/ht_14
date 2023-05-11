import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { User, UserModelType, UserSchema } from './users-schema';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersRepository } from './repositories/users.repository';
import { AuthService } from '../auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { AuthModule } from '../auth/auth.module';
import { EmailService } from '../email/email.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    // forwardRef(() => AuthModule),
    // AuthModule,
  ],
  providers: [
    UsersService,
    UsersRepository,
    AuthService,
    JwtService,
    EmailService,
  ],
  exports: [UsersService],
})
export class UsersModule {}
