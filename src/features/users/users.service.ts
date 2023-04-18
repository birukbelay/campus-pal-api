import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { emailRegex } from './entities/user.entity';
import { User, UserDocument } from './entities/user.entity';

import { PagUserRes } from './dto/resp.user.dto';

import { PaginationInput, logTrace } from './dependencies.user';
import { MongoGenericRepository } from './dependencies.user';
import { FilterQuery, Model } from 'mongoose';

@Injectable()
export class UserService extends MongoGenericRepository<User> {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {
    super(userModel);
  }

  public async findOneWithPwd(where: FilterQuery<User>): Promise<User> {
    logTrace('findinguser=', where);
    const user: User = await this.userModel
      .findOne(where)
      .select(
        '+password +verificationCodeHash +verificationCodeExpires +hashedRefreshToken',
      )
      .lean();
    logTrace('foundUser=', user);
    return user;
  }
  async userExists(phoneOrEmail: string) {
    const isEmail = emailRegex.test(phoneOrEmail);
    let user: User | null;
    if (isEmail) {
      user = await this.findOneWithPwd({ email: phoneOrEmail });
    } else {
      user = await this.findOneWithPwd({ phone: phoneOrEmail });
    }
    if (!user) return null;
    return user;
  }

  public async searchUsers(
    q: string,
    pagination?: PaginationInput,
  ): Promise<PagUserRes> {
    const text = q.trim();
    const count: number = await this.userModel.countDocuments({
      $or: [
        { username: new RegExp(text, 'i') },
        { email: new RegExp(text, 'i') },
      ],
    });
    const limit = pagination?.limit || 25;
    const page = pagination?.page || 1;

    const users: User[] = await this.userModel
      .find({
        $or: [
          { username: new RegExp(text, 'i') },
          { email: new RegExp(text, 'i') },
        ],
      })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();
    return { count, users };
  }
}
