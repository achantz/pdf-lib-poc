import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { FileController } from './file.controller';
import { File, FileSchema } from './file.schema';
import { FileService } from './file.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: File.name, schema: FileSchema }]),
  ],
  exports: [FileService],
  controllers: [FileController],
  providers: [FileService],
})
export class FileModule {}
