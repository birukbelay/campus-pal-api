import { IsEmail, IsOptional, IsString } from 'class-validator';

export class UserWhereUniqueInput {
  @IsString()
  @IsOptional()
  _id?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  phone?: string;
}
