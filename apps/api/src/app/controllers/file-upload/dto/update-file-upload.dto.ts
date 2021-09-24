import { PartialType } from '@nestjs/mapped-types';

import { CreateFileUploadDto } from './create-file-upload.dto';

export class UpdateUploadDto extends PartialType(CreateFileUploadDto) {}
