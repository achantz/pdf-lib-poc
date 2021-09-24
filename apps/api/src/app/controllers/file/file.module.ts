import { Module } from '@nestjs/common';

import { FileUploadModule } from './../file-upload/file-upload.module';
import { FileController } from './file.controller';
import { FileService } from './file.service';

@Module({
  imports: [FileUploadModule],
  controllers: [FileController],
  providers: [FileService, FileUploadModule],
})
export class FileModule {}
