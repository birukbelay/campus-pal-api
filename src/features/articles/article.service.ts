import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';

import { Article, ArticleDocument } from './entities/article.entity';

import { PaginationInput, logTrace } from './dependencies.article';
import { MongoGenericRepository } from './dependencies.article';
import mongoose, { FilterQuery, Model } from 'mongoose';
import { PagUserRes } from './dto/article.dto';

@Injectable()
export class ArticleService extends MongoGenericRepository<Article> {
  constructor(
    @InjectModel(Article.name) private articleModel: Model<ArticleDocument>,
    @InjectConnection() private readonly connection: mongoose.Connection,
  ) {
    super(articleModel);
  }

  public async SearchArticles(
    q: string,
    pagination?: PaginationInput,
  ): Promise<PagUserRes> {
    const text = q.trim();
    const count: number = await this.articleModel.countDocuments({
      $or: [{ title: new RegExp(text, 'i') }, { body: new RegExp(text, 'i') }],
    });
    const limit = pagination?.limit || 25;
    const page = pagination?.page || 1;

    const users: Article[] = await this.articleModel
      .find({
        $or: [
          { title: new RegExp(text, 'i') },
          { body: new RegExp(text, 'i') },
        ],
      })
      .skip((page - 1) * limit)
      .limit(limit)
      .sort('importance')
      .lean();
    return { count, users };
  }

  public async ArticleByTags(tags: string[]) {
    const articles = await this.articleModel
      .find({ tags: { $in: tags } })
      .sort('importance');
    return articles;
  }

  public async UpVote(articleId: string, userId) {
    try {
      // const session = await this.connection.startSession();

      // await session.withTransaction(async () => {
      let ctr = 0;
      // upvoting
      const addResult = await this.articleModel.updateOne(
        { _id: articleId, upVotersIds: { $ne: userId } },
        { $addToSet: { upVotersIds: userId } },
      );
      // .session(session);
      if (addResult.matchedCount >= 1 && addResult.modifiedCount >= 1) {
        ctr++;
      }
      const delResult = await this.articleModel.updateOne(
        { _id: articleId, downVotersIds: userId },
        { $pull: { downVotersIds: userId } },
      );
      // .session(session);
      if (delResult.matchedCount >= 1 && delResult.modifiedCount >= 1) {
        ctr++;
      }
      if (ctr > 0) {
        const result = await this.articleModel.updateOne(
          { _id: articleId },
          { $inc: { importance: ctr } },
        );
      }
      // });
      // session.endSession();
      return true;
    } catch (e) {
      logTrace('upvoteError', e.message);
      return false;
    }
  }

  public async DownVote(articleId: string, userId) {
    try {
      // const session = await this.connection.startSession();

      // await session.withTransaction(async () => {
      let ctr = 0;
      // upvoting
      const delResult = await this.articleModel.updateOne(
        { _id: articleId, downVotersIds: { $ne: userId } },
        { $addToSet: { downVotersIds: userId } },
      );
      // .session(session);
      if (delResult.matchedCount >= 1 && delResult.modifiedCount >= 1) {
        ctr++;
      }
      const addResult = await this.articleModel.updateOne(
        { _id: articleId, upVotersIds: userId },
        { $pull: { upVotersIds: userId } },
      );
      // .session(session);
      if (addResult.matchedCount >= 1 && addResult.modifiedCount >= 1) {
        ctr++;
      }
      if (ctr > 0) {
        const result = await this.articleModel.updateOne(
          { _id: articleId },
          { $inc: { importance: -ctr } },
        );
      }
      // });
      // session.endSession();
      return true;
    } catch (e) {
      return false;
    }
  }
}
