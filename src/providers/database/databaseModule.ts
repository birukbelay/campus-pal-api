import { Module } from '@nestjs/common';

import { MongooseModule } from '@nestjs/mongoose';
import { DatabaseService } from './database.service';
// import { EnvConfigs } from '../../common/config/config.instances';
import { getMongoUri, _CONF_NAMES } from '../../common/config/configTypes';

const mongoUri = getMongoUri(
  _CONF_NAMES.mongodbUri,
  'mongodb://127.0.0.1:27017/test9',
);
@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: () => ({
        uri: mongoUri,
      }),
    }),

    // MongooseModule.forRoot(EnvConstants.mongodbUri),
    // TypegooseModule.forRoot(EnvConfigs.mongodbUri),
  ],
  providers: [DatabaseService],
  exports: [DatabaseService],
})
export class DatabaseModule {}
