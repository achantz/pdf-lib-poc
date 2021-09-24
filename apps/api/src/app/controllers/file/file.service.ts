import { Injectable, NotFoundException } from '@nestjs/common';

import { FileUploadService } from './../file-upload/file-upload.service';

@Injectable()
export class FileService {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor(private fileUploadService: FileUploadService) {}

  async getFileAsBinary(id: string) {
    const fileUpload = await this.fileUploadService.findOne(id);

    if (!fileUpload) {
      throw new NotFoundException();
    }

    // get binary data to send
  }
}
