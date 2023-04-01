import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Post, PostDocument } from '../posts-schema';
import { Model } from 'mongoose';
import { PostViewDTO } from '../types';

@Injectable()
export class PostsQueryRepository {
  constructor(@InjectModel(Post.name) private PostModel: Model<PostDocument>) {}

  async getPost(id: string): Promise<PostViewDTO | null> {
    const post: PostDocument = await this.PostModel.findOne()
      .where('_id')
      .equals(id);
    if (!post) return null;
    return {
      id: post._id.toString(),
      title: post.title,
      shortDescription: post.shortDescription,
      content: post.content,
      blogId: post.blogId,
      blogName: post.blogName,
      createdAt: post.createdAt,
      extendedLikesInfo: {
        likesCount: 0,
        dislikesCount: 0,
        myStatus: 'None',
        newestLikes: [],
      },
    };
  }

  async getPosts(
    blogId: string | null,
    pageNumber: number,
    pageSize: number,
    sortBy: string,
    sortDirection: string,
  ) {
    let filter = {};
    if (blogId) filter = { blogId: blogId };

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

    const totalCount = await this.PostModel.count(filter);
    const pageCount = Math.ceil(+totalCount / pageSize);

    /*const items = await this.PostModel.find(filter)
      .sort(sortFilter)
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize);*/

    console.log('sort filter -->', sortFilter);

    const items = await this.PostModel.aggregate([
      {
        $project:
          /**
           * specifications: The fields to
           *   include or exclude.
           */
          {
            _id: 0,
            id: {
              $toString: '$_id',
            },
            title: 1,
            shortDescription: 1,
            content: 1,
            blogId: 1,
            blogName: 1,
            createdAt: 1,
            likeStatuses: 1,
          },
      },
      {
        $project:
          /**
           * specifications: The fields to
           *   include or exclude.
           */
          {
            likeStatuses: 0,
          },
      },
      {
        $match:
          /**
           * query: The query in MQL.
           */
          filter,
      },
      {
        $sort:
          /**
           * Provide any number of field/order pairs.
           */
          sortFilter,
      },
      {
        $skip:
          /**
           * Provide the number of documents to skip.
           */
          (pageNumber - 1) * pageSize,
      },
      {
        $limit:
          /**
           * Provide the number of documents to limit.
           */
          pageSize,
      },
      {
        $addFields:
          /**
           * newField: The new field name.
           * expression: The new field expression.
           */
          {
            extendedLikesInfo: {
              likesCount: 0,
              dislikesCount: 0,
              myStatus: 'None',
              newestLikes: [],
            },
          },
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
