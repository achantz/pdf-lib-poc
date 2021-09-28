import { Bind, Controller, Delete, Get, Param, Post, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express/multer';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { Express } from 'express';
import * as fs from 'fs';
import { Multer } from 'multer';
import { join } from 'path';
import { PDFExtract } from 'pdf.js-extract';

import { PDFInterceptor } from '../../interceptors/pdf.intrerceptor';
import { CreateFileDto } from './dto/create-file.dto';
import { FileService } from './file.service';

/* eslint-disable @typescript-eslint/no-unused-vars */
// eslint-disable-next-line @typescript-eslint/no-unused-vars

export const multerOptions = {
  dest: './files',
  fileFilter: (req, file, callback) => {
    if (fs.existsSync(file.path) && file.mimetype === 'application/pdf') {
      const extract = new PDFExtract();
      const meta = extract.extract(file.path).then((meta) => {
        if (meta) {
          if (meta.meta?.info?.IsXFAPresent) {
            return callback(
              new Error('Cannot process PDF files with XFA forms'),
              false
            );
          }
        }
      });
    }
    return callback(null, true);
  },
} as MulterOptions;

// export const storage = {
//   memoryStorage
// }

@Controller('file-upload')
@ApiTags('file-upload')
export class FileController {
  rootDir = './files';

  constructor(private readonly fileService: FileService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file', multerOptions), PDFInterceptor)
  @Bind(UploadedFile())
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
  async single(@UploadedFile() file: Express.Multer.File) {
    const fileUpload = {
      _id: file.filename,
      fileName: file.originalname,
      mimeType: file.mimetype,
    } as CreateFileDto;

    this.fileService.create(fileUpload);

    return fileUpload;
  }

  @Get()
  findAll() {
    return this.fileService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res) {
    const fileData = await this.fileService.findOne(id);

    const filePath = join(process.cwd(), this.rootDir, id);
    res.set('Content-Type', fileData.mimeType);
    res.download(filePath, fileData.fileName);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateUploadDto: UpdateUploadDto) {
  //   return this.uploadService.update(+id, updateUploadDto);
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.fileService.remove(id);
  }
}
