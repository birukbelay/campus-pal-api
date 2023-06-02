import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';

import { Tag, TagDocument } from './entities/tags.entity';

import { PaginationInput, logTrace } from './tags.dependencies';
import { MongoGenericRepository } from './tags.dependencies';
import mongoose, { Model } from 'mongoose';
import { PagUserRes } from './dto/tags.dto';

@Injectable()
export class TagsService extends MongoGenericRepository<Tag> {
  constructor(
    @InjectModel(Tag.name) private tagModel: Model<TagDocument>,
    @InjectConnection() private readonly connection: mongoose.Connection,
  ) {
    super(tagModel);
  }

  public async SearchArticles(
    q: string,
    pagination?: PaginationInput,
  ): Promise<PagUserRes> {
    const text = q.trim();
    const count: number = await this.tagModel.countDocuments({
      name: new RegExp(text, 'i'),
    });
    const limit = pagination?.limit || 25;
    const page = pagination?.page || 1;

    const users: Tag[] = await this.tagModel
      .find({
        name: new RegExp(text, 'i'),
      })
      .skip((page - 1) * limit)
      .limit(limit)
      .sort('count')
      .lean();
    return { count, data: users };
  }
}
