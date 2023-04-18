import { Document } from 'mongoose';

import { Prop as MProp, Schema, SchemaFactory } from '@nestjs/mongoose';

import { ApiHideProperty } from '@nestjs/swagger';

import { RoleType } from '../dependencies.user';

export const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

@Schema()
export class User {
  // @MProp({
  //   get: (id: string) => {
  //     return id
  //   },
  // })
  readonly _id: string;

  @MProp({ type: String, unique: true })
  phone: string;

  @MProp({ type: String, unique: true, sparse: true })
  email: string;

  @MProp({ type: String })
  firstName: string;

  @MProp({ type: String })
  lastName: string;

  fullName?: string;

  @MProp({ type: String, select: false })
  @ApiHideProperty()
  password: string;

  @MProp({ required: false })
  avatar?: string;

  @MProp({
    type: String,
    enum: Object.values(RoleType),
    default: RoleType.USER,
  })
  role: RoleType = RoleType.USER;

  @ApiHideProperty()
  @MProp({ type: String, select: false })
  hashedRefreshToken: string;

  @MProp({ type: String, select: false, required: false })
  @ApiHideProperty()
  verificationCodeHash: string;

  @MProp({ select: false, required: false })
  @ApiHideProperty()
  verificationCodeExpires: number;

  @MProp({ type: String, select: false, required: false })
  @ApiHideProperty()
  active: boolean;
}
export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);
// Create indexes
UserSchema.index({ phone: 'text', email: 'text' });

// Hook before insert or save

UserSchema.pre('save', setDefaultFullName);

UserSchema.virtual('id').get(function () {
  return this._id;
});

async function setDefaultFullName(this: User, next) {
  try {
    if (this.firstName && !this.fullName) {
      this.fullName = this.firstName + ' ' + this.lastName;
    }
    return next();
  } catch (error) {
    return next(error);
  }
}
