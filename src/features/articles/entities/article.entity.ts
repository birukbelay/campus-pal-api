import mongoose, { Document, Types } from 'mongoose';

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { ApiHideProperty } from '@nestjs/swagger';

import { User } from '../../users';

@Schema()
export class Article {
  readonly _id: string;

  @Prop({ type: String })
  body: string;

  @Prop({ type: Types.ObjectId, required: true, ref: 'User' })
  ownerId: User['_id'];

  @Prop({ type: String })
  title: string;

  @Prop({ type: String })
  coverImage: string;

  @Prop({ type: [{ type: String, ref: 'Tag.Name' }] })
  tags: string[];

  @Prop({ type: Number, required: true, default: 0 })
  importance: number;

  @Prop({ type: Number, required: true, default: 0 })
  upvoteCount: number;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] })
  upVotersIds: string[];

  @Prop({ type: Number, required: true, default: 0 })
  downVoteCount: number;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] })
  downVotersIds: string[];

  @Prop([String])
  refs: string[];

  @Prop({ type: String, select: false, required: false })
  active: boolean;
}
export type ArticleDocument = Article & Document;
export const ArticleSchema = SchemaFactory.createForClass(Article);
// Create indexes
ArticleSchema.index({ title: 'text', body: 'text' });
