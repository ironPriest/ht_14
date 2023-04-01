import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../users-schema';
import { Model } from 'mongoose';
import * as cluster from 'cluster';
import { UserViewDTO } from '../types';

@Injectable()
export class UsersQueryRepository {
  constructor(@InjectModel(User.name) private UserModel: Model<UserDocument>) {}

  async getUser(id: string): Promise<UserViewDTO | null> {
    const user: UserDocument = await this.UserModel.findOne()
      .where('_id')
      .equals(id);
    if (!user) return null;
    return {
      id: user._id.toString(),
      login: user.login,
      email: user.email,
      createdAt: user.createdAt,
    };
  }

  async getUsers(
    pageNumber: number,
    pageSize: number,
    sortBy: string,
    sortDirection: string,
    searchLoginTerm: string | null,
    searchEmailTerm: string | null,
  ) {
    let filter: any = {};
    if (searchLoginTerm)
      filter.login = { $regex: searchLoginTerm, $options: 'i' };
    if (searchEmailTerm)
      filter.email = { $regex: searchEmailTerm, $options: 'i' };
    if (searchLoginTerm && searchEmailTerm)
      filter = {
        $or: [
          { login: { $regex: searchLoginTerm, $options: 'i' } },
          { email: { $regex: searchEmailTerm, $options: 'i' } },
        ],
      };

    const sortFilter: any = {};

    switch (sortDirection) {
      case 'asc':
        sortFilter[sortBy] = 1;
        break;
      case 'desc':
        sortFilter[sortBy] = -1;
        break;
    }

    const totalCount = await this.UserModel.count(filter);
    const pageCount = Math.ceil(+totalCount / pageSize);

    const items = await this.UserModel.aggregate([
      {
        $project: {
          _id: 0,
          id: {
            $toString: '$_id',
          },
          login: 1,
          email: 1,
          createdAt: 1,
        },
      },
      {
        $match: filter,
      },
      {
        $sort: sortFilter,
      },
      {
        $skip: (pageNumber - 1) * pageSize,
      },
      {
        $limit: pageSize,
      },
    ]);

    return {
      pagesCount: pageCount,
      page: pageNumber,
      pageSize: pageSize,
      totalCount: totalCount,
      items: items,
    };
  }
}
