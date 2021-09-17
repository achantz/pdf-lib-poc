import { Controller, Post, UploadedFile, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import * as fs from 'fs';
import { memoryStorage } from 'multer';
import path = require('path');

import { FileService } from './../services/file.service';
import { PdfService } from './../services/pdf.service';

@Controller('files')
export class FilesController {
  memStorage = memoryStorage();

  constructor(
    private fileService: FileService,
    private pdfService: PdfService
  ) {}

  @Post('cleanup')
  async deleteAllFiles() {
    const rootDir = './files/store';
    const files = fs.readdirSync(rootDir);
    const deletedFiles = [];
    await this.fileService.removeFilesFromDB(files);
    files.forEach((file) => {
      const filePath = path.join(rootDir, file);
      fs.unlinkSync(filePath);
      deletedFiles.push(filePath);
    });

    return { deletedFiles: [...deletedFiles] };
  }

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file) {
    const response = {
      originalName: file.originalname,
      fileName: file.filename,
      mimeType: file.mimetype,
      buffer: file.bufer,
    };

    const isFillablePDF = await this.pdfService.isFillabePDFFromMetadata(
      path.join('files/store/', file.filename)
    );

    console.log(`PDF Form: ${isFillablePDF}`);

    //this.fileService.writeFileToDB(file);

    return response;
  }

  @Post('multiple')
  @UseInterceptors(FilesInterceptor('file'))
  uploadMultipleFiles(@UploadedFiles() files) {
    const response = [];
    files.forEach((file) => {
      const fileResponse = {
        originalName: file.originalname,
        fileName: file.filename,
        mimeType: file.mimetype,
      };
      response.push(fileResponse);

      this.fileService.writeFileToDB(file);
    });
    return response;
  }
}
