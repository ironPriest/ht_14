import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Blog, BlogDocument } from '../blogs-schema';
import { Model, Types } from 'mongoose';
import { BlogViewDTO } from '../types';

@Injectable()
export class BlogsQueryRepository {
  constructor(@InjectModel(Blog.name) private BlogModel: Model<BlogDocument>) {}

  async getBlog(id: string): Promise<BlogViewDTO | null> {
    const blog: BlogDocument = await this.BlogModel.findOne()
      .where('_id')
      .equals(id);
    if (!blog) return null;
    return {
      id: blog._id.toString(),
      name: blog.name,
      websiteUrl: blog.websiteUrl,
      description: blog.description,
      createdAt: blog.createdAt,
      isMembership: blog.isMembership,
    };
  }

  async getBlogs(
    searchNameTerm: string | null,
    pageNumber: number,
    pageSize: number,
    sortBy: string,
    sortDirection: string,
  ) {
    let filter: any = {};
    if (searchNameTerm)
      filter = { name: { $regex: searchNameTerm, $options: 'i' } };

    /* eslint-disable */
    let sortFilter: any = {};
    /* eslint-enable */

    switch (sortDirection) {
      case 'asc':
        sortFilter[sortBy] = 1;
        break;
      case 'desc':
        sortFilter[sortBy] = -1;
        break;
    }

    const totalCount = await this.BlogModel.count(filter);
    const pageCount = Math.ceil(+totalCount / pageSize);

    const items = await this.BlogModel.aggregate([
      {
        $project: {
          _id: 0,
          id: {
            $toString: '$_id',
          },
          name: 1,
          description: 1,
          websiteUrl: 1,
          createdAt: 1,
          isMembership: 1,
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
