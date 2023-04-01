import { Injectable } from '@nestjs/common';
import { UserInputDTO } from './types';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserModelType } from './users-schema';
import { UsersRepository } from './repositories/users.repository';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private UserModel: UserModelType,
    protected usersRepository: UsersRepository,
  ) {}

  async create(DTO: UserInputDTO): Promise<string> {
    const user = this.UserModel.createUser(DTO, this.UserModel);
    await this.usersRepository.save(user);
    return user._id.toString();
  }

  async delete(userId: string) {
    await this.usersRepository.delete(userId);
  }
}
