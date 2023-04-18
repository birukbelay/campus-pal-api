import { FilterQuery, Model, UpdateQuery } from 'mongoose';
// import { IGenericRepository } from './IGenericRepo';

import { PaginationInputs } from '../common.types';
import { ColorEnums, logTrace } from '../logger';
import { RemovedModel, UpdateResponse } from './mongo.entity';

export class PaginatedResponse<T> {
  count: number;
  data: T[];
}

export abstract class MongoGenericRepository<T> {
  private _repository: Model<T>;
  private _populateOnFind: string[];

  protected constructor(repository: Model<T>, populateOnFind: string[] = []) {
    this._repository = repository;
    this._populateOnFind = populateOnFind;
  }

  //-----  find One Query
  async findById(id: string): Promise<T> {
    try {
      const item: T = await this._repository
        .findById(id)
        .populate(this._populateOnFind)
        .lean();
      return item;
    } catch (e) {
      logTrace(
        `${this._repository.modelName}--FindByIdError=`,
        e.message,
        ColorEnums.FgRed,
      );
      throw e;
    }
  }
  public async findOne(where: FilterQuery<T>): Promise<T> {
    try {
      const user: T = await this._repository
        .findOne(where)
        .populate(this._populateOnFind)
        .lean();
      return user;
    } catch (e) {
      logTrace(
        `${this._repository.modelName}--FindOneError=`,
        e.message,
        ColorEnums.FgRed,
      );
      throw e;
    }
  }

  //----- find many query
  async getAll(): Promise<T[]> {
    try {
      const user: T[] = await this._repository
        .find()
        .populate(this._populateOnFind)
        .exec();
      return user;
    } catch (e) {
      logTrace(
        `${this._repository.modelName}--find() error=`,
        e.message,
        ColorEnums.FgRed,
      );
      throw e;
    }
  }
  public async findMany(
    filter: FilterQuery<T>,
    pagination?: PaginationInputs,
  ): Promise<PaginatedResponse<T>> {
    let items: T[] = [];
    // Always make default pagination = 25 with first page
    const limit = pagination?.limit || 25;
    const page = pagination?.page || 1;
    try {
      items = await this._repository
        .find(filter)
        .skip((page - 1) * limit)
        .limit(limit)
        .lean();

      const count = await this._repository.countDocuments(filter);

      return { count, data: items };
    } catch (e) {
      logTrace(
        `${this._repository.modelName}--findManyError=`,
        e.message,
        ColorEnums.FgRed,
      );
      throw e;
    }
  }

  //Create Query
  async createOne(input: Partial<T>): Promise<T> {
    try {
      const created: T = await this._repository.create({ ...input });
      logTrace('created Model=', created, ColorEnums.BgGreen);
      return created;
    } catch (e) {
      logTrace(
        `${this._repository.modelName}--CreateError =`,
        e.message,
        ColorEnums.FgRed,
      );
      throw e;
    }
  }

  //Update queries
  async updateById(_id: string, input: UpdateQuery<T>) {
    try {
      const updated: T = await this._repository
        .findByIdAndUpdate(_id, input, { new: true })
        .lean();
      return updated;
    } catch (e) {
      logTrace(
        `${this._repository.modelName}--UpdateByIdError =`,
        e.message,
        ColorEnums.FgRed,
      );
      throw e;
    }
  }

  //Update queries
  async upsertOne(filter: FilterQuery<T>, input: UpdateQuery<T>) {
    try {
      const updated: UpdateResponse = await this._repository
        .updateOne(filter, input, { new: true })
        .lean();
      return updated;
    } catch (e) {
      logTrace(
        `${this._repository.modelName}--updateOneError =`,
        e.message,
        ColorEnums.FgRed,
      );
      throw e;
    }
  }

  //Update queries
  async updateOne(filter: FilterQuery<T>, input: UpdateQuery<T>): Promise<T> {
    try {
      const updated: T = await this._repository
        .findOneAndUpdate(filter, input)
        .lean();
      return updated;
    } catch (e) {
      logTrace(
        `${this._repository.modelName}--updateOneError =`,
        e.message,
        ColorEnums.FgRed,
      );
      throw e;
    }
  }

  public async updateMany(filter: FilterQuery<T>, input: UpdateQuery<T>) {
    try {
      const updated: UpdateResponse = await this._repository
        .updateMany(filter, input, { new: true })
        .lean();
      return updated;
    } catch (e) {
      logTrace(
        `${this._repository.modelName}--UpdateManyError =`,
        e.message,
        ColorEnums.FgRed,
      );
      throw e;
    }
  }

  //------------ Delete Queries
  public async deleteById(_id: string) {
    try {
      const deleted: T = await this._repository.findByIdAndDelete(_id).lean();
      if (!deleted) throw new Error('not found');
      return deleted;
    } catch (e) {
      logTrace(
        `${this._repository.modelName}--DeleteByIdError =`,
        e.message,
        ColorEnums.FgRed,
      );
      throw e;
    }
  }

  async deleteOne(filter: FilterQuery<T>): Promise<any> {
    try {
      const deleted: RemovedModel = await this._repository.deleteOne(filter);
      return deleted;
    } catch (e) {
      logTrace(
        `${this._repository.modelName}--DeleteOneError =`,
        e.message,
        ColorEnums.FgRed,
      );
      throw e;
    }
  }

  public async deleteMany(filter: FilterQuery<T>): Promise<any> {
    try {
      const deleted: RemovedModel = await this._repository.deleteMany(filter);
      return deleted;
    } catch (e) {
      logTrace(
        `${this._repository.modelName}--DeleteManyError =`,
        e.message,
        ColorEnums.FgRed,
      );
      throw e;
    }
  }
}
