import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { FileUploadModule } from './controllers/file-upload/file-upload.module';
import { FileModule } from './controllers/file/file.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/upload'),
    FileUploadModule,
    FileModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
