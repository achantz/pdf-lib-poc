import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as fs from 'fs';
import { Model } from 'mongoose';
import { join } from 'path';

import { CreateFileUploadDto } from './dto/create-file-upload.dto';
import { FileUpload } from './file-upload.schema';

//import { UpdateUploadDto } from './dto/update-upload.dto';
@Injectable()
export class FileUploadService {
  constructor(
    @InjectModel(FileUpload.name) private uploadModel: Model<FileUpload>
  ) {}

  create(createUploadDto: CreateFileUploadDto): Promise<FileUpload> {
    const createdUpload = new this.uploadModel(createUploadDto);
    return createdUpload.save();
  }

  findAll(): Promise<FileUpload[]> {
    return this.uploadModel.find().exec();
  }

  async findOne(id: string): Promise<FileUpload> {
    const fileUpload = await this.uploadModel.findById(id).exec();

    if (!fileUpload) {
      throw new NotFoundException();
    }

    return fileUpload;
  }

  // update(id: number, updateUploadDto: UpdateUploadDto) {
  //   return `This action updates a #${id} upload`;
  // }

  async remove(id: string) {
    const deletedFile = await this.uploadModel.findByIdAndDelete(id).exec();
    fs.unlinkSync(join('./files/', deletedFile._id));
    return deletedFile;
  }
}
