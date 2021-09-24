import { Bind, Controller, Delete, Get, Param, Post, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express/multer';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { Express } from 'express';
import { Multer } from 'multer';

import { PdfFormInterceptor } from '../../interceptors/pdf-form.interceptor';
import { CreateFileUploadDto } from './dto/create-file-upload.dto';
import { FileUploadService } from './file-upload.service';
import { PdfService } from './pdf.service';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const multerOptions = {
  dest: './files',
} as MulterOptions;

@Controller('file-upload')
@ApiTags('file-upload')
export class FileUploadController {
  rootDir = './files';

  constructor(
    private readonly fileUploadService: FileUploadService,
    private readonly pdfService: PdfService
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('file', multerOptions), PdfFormInterceptor)
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
    } as CreateFileUploadDto;

    await this.fileUploadService.create(fileUpload).then((data) => {
      console.log(data);
    });

    //console.log(file);
    return fileUpload;
  }

  @Get()
  findAll() {
    return this.fileUploadService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.fileUploadService.findOne(id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateUploadDto: UpdateUploadDto) {
  //   return this.uploadService.update(+id, updateUploadDto);
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.fileUploadService.remove(id);
  }
}
