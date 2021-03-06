import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class File extends Document {
  @Prop({ required: true })
  _id: string;

  @Prop({ required: true })
  fileName: string;

  @Prop({ required: true })
  mimeType: string;
}
export const FileSchema = SchemaFactory.createForClass(File);
