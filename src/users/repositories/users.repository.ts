import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../users-schema';
import { Model } from 'mongoose';

@Injectable()
export class UsersRepository {
  constructor(@InjectModel(User.name) private UserModel: Model<UserDocument>) {}

  async save(user: UserDocument) {
    await user.save();
  }

  async deleteAll() {
    await this.UserModel.deleteMany({});
  }

  async delete(userId: string) {
    await this.UserModel.deleteOne().where('_id').equals(userId);
  }
}
