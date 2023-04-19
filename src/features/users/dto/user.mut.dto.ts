import { PartialType } from '@nestjs/swagger';
import { RoleType } from '../dependencies.user';
import {
  IsEmail,
  IsMobilePhone,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class RegisterUserInput {
  @IsNotEmpty()
  @IsMobilePhone()
  phone: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  password: string;

  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsString()
  avatar?: string;
}

export class UpdateMeDto {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  fullName?: string;

  @IsOptional()
  @IsString()
  avatar?: string;
}

export class UpdateUserWithRole extends PartialType(RegisterUserInput) {
  @IsString()
  @IsOptional()
  role?: RoleType;
}
export class UpdatePhoneInput {
  @IsMobilePhone()
  phone: string;
}
