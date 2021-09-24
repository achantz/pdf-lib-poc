import { Controller, Get, NotFoundException, Param, Res, UploadedFile } from '@nestjs/common';
import { resolveSoa } from 'dns';
import * as fs from 'fs';
import { join } from 'path';

import { FileUploadService } from './../file-upload/file-upload.service';

/* eslint-disable @typescript-eslint/no-unused-vars */
@Controller('file')
export class FileController {
  rootDir = './files';

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor(private fileUploadService: FileUploadService) {}

  @Get(':id')
  async getFile(@Param('id') id: string, @Res() res): Promise<any> {
    //async getFile(@Param('id') id: string) {
    const fileUpload = await this.fileUploadService.findOne(id);

    if (!fileUpload) {
      throw new NotFoundException();
    }
    const filePath = join(process.cwd(), this.rootDir, fileUpload._id);
    res.set('Content-Type', fileUpload.mimeType);
    res.download(filePath, fileUpload.fileName);
  }
}
