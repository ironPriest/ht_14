import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { User, UserModelType, UserSchema } from './users-schema';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersRepository } from './repositories/users.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [UsersService, UsersRepository],
  exports: [UsersService],
})
export class UsersModule {}
