import { Controller, Post, UploadedFile, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import * as fs from 'fs';
import path = require('path');

import { PdfFormInterceptor } from '../../interceptors/pdf-form.interceptor';
import { PdfService } from '../file-upload/pdf.service';

@Controller('files')
@ApiTags('files')
export class FilesController {
  //memStorage = memoryStorage();

  constructor(private pdfService: PdfService) {}

  @Post('cleanup')
  async deleteAllFiles() {
    const rootDir = './files/store';
    const files = fs.readdirSync(rootDir);
    const deletedFiles = [];
    //await this.fileService.removeFilesFromDB(files);
    files.forEach((file) => {
      const filePath = path.join(rootDir, file);
      fs.unlinkSync(filePath);
      deletedFiles.push(filePath);
    });

    return { deletedFiles: [...deletedFiles] };
  }

  @Post()
  @UseInterceptors(FileInterceptor('file'), PdfFormInterceptor)
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async uploadFile(@UploadedFile() file) {
    const response = {
      originalName: file.originalname,
      fileName: file.filename,
      mimeType: file.mimetype,
      buffer: file.bufer,
    };

    // write file to filesystem
    //this.fileService.writeFileToDB(file);

    //const filePath = path.join('files/store/', file.filename);
    //this.pdfService.flattenPDF(filePath);

    //let isAcroForm = false;
    //let isXFA = false;

    // if (fs.existsSync(filePath)) {
    //   isAcroForm = await this.pdfService.isAcroForm(filePath);
    //   isXFA = await this.pdfService.isAXFA(filePath);
    // }

    // const isFillablePDF = await this.pdfService.isAcroForm(
    //   path.join('files/store/', file.filename)
    // );

    // console.log(`PDF Form: ${isFillablePDF}`);

    //this.fileService.writeFileToDB(file);

    return response;
  }

  @Post('multiple')
  @UseInterceptors(FilesInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    },
  })
  uploadMultipleFiles(@UploadedFiles() files) {
    const response = [];
    files.forEach((file) => {
      const fileResponse = {
        originalName: file.originalname,
        fileName: file.filename,
        mimeType: file.mimetype,
      };
      response.push(fileResponse);

      //this.fileService.writeFileToDB(file);
    });
    return response;
  }
}
