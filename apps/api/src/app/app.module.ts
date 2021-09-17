import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';

import { FilesController } from './controllers/files.controller';
import { FileService } from './services/file.service';
import { PdfService } from './services/pdf.service';

@Module({
  imports: [
    MulterModule.register({
      dest: './files/store',
    }),
  ],
  controllers: [FilesController],
  providers: [FileService, PdfService],
})
export class AppModule {}
