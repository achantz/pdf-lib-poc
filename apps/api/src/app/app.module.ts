import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { FileModule } from './controllers/file/file.module';

@Module({
  imports: [MongooseModule.forRoot('mongodb://localhost/upload'), FileModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
