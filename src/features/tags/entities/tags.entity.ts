import mongoose, { Document, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
//
//
// @Schema()
// export class Count {
//   @Prop()
//   questionCount: number;
//
//   @Prop({ type: Number, required: false, default: 0 })
//   articleCount: number;
//
//
// }
@Schema()
export class Tag {
  @ApiProperty({ name: 'id' })
  readonly _id: string;

  @Prop({ type: String, unique: true })
  name: string;

  @Prop({ type: String })
  type?: string;

  @Prop({ type: Number, required: false, default: 0 })
  count: number;

  @Prop({ type: String })
  coverImage?: string;

  @Prop({ type: String, select: false, required: false, default: false })
  restricted = false;
}
export type TagDocument = Tag & Document;
export const TagSchema = SchemaFactory.createForClass(Tag);
// Create indexes
TagSchema.index({ name: 'text' });
