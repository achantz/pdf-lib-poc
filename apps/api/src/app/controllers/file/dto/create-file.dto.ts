import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateFileDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly _id: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly fileName: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly mimeType: string;
}
