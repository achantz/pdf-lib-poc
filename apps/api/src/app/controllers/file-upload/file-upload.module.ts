import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { FileUploadController } from './file-upload.controller';
import { FileUpload, FileUploadSchema } from './file-upload.schema';
import { FileUploadService } from './file-upload.service';
import { PdfService } from './pdf.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: FileUpload.name, schema: FileUploadSchema },
    ]),
  ],
  exports: [FileUploadService],
  controllers: [FileUploadController],
  providers: [FileUploadService, PdfService],
})
export class FileUploadModule {}
