import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as fs from 'fs';
import { Model } from 'mongoose';
import { join } from 'path';

import { CreateFileDto } from './dto/create-file.dto';
import { File } from './file.schema';

//import { UpdateUploadDto } from './dto/update-upload.dto';
@Injectable()
export class FileService {
  constructor(@InjectModel(File.name) private uploadModel: Model<File>) {}

  create(createUploadDto: CreateFileDto): Promise<File> {
    const createdUpload = new this.uploadModel(createUploadDto);
    return createdUpload.save();
  }

  findAll(): Promise<File[]> {
    return this.uploadModel.find().exec();
  }

  async findOne(id: string): Promise<File> {
    const fileUpload = await this.uploadModel.findById(id).exec();

    if (!fileUpload) {
      throw new NotFoundException();
    }

    return fileUpload;
  }

  async remove(id: string) {
    const deletedFile = await this.uploadModel.findByIdAndDelete(id).exec();
    fs.unlinkSync(join('./files/', deletedFile._id));
    return deletedFile;
  }
}
