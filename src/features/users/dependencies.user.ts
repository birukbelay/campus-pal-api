// the problem with this is we dont know who is importing this, solved by importing using `as`

// ** Types
export { UserFromToken as UserFromToken } from '../../common/common.types';
export { logTrace as logTrace } from '../../common/logger';
//common
export { MongoGenericRepository as MongoGenericRepository } from '../../common/base/mongo.base.repo';

export { PaginationInput } from '../../common/http/common.dto';
export { RoleType } from '../../common/common.types';

/*




    ** ## Dependencies by file

 >> Dto:: @nestjs/graphql(fields) class-validator
 >> model:  @nestjs/graphql(fields) @typegoose/typegoose(prop)
 >> services -
      - NestJs: @nestjs/common(Injectable)   nestjs-typegoose(InjectModel)
      - Other:  @typegoose/typegoose(ReturnModelType)
 >> Resolvers: @nestjs/graphql
 >> tests: graphql-tag supertest-graphql
 >> usersModule: @nestjs/mongoose(MongooseModule)

       ## ? Installed Dependencies
 - Nest js core
      - @nestjs/common  @nestjs/mapped-types
 - other nest-js
      - @nestjs/graphql @nestjs/mongoose nestjs-typegoose
 - class-validator slugify
 - database
    - mongoose @typegoose/typegoose
* */
