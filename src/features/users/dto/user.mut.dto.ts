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
  @IsMobilePhone()
  // @Validate(UserExitsValidator)
  phone: string;

  @IsEmail()
  @IsOptional()
  // @Validate(UserExitsValidator)
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

export class UpdateUserDto {
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

export class UpdateUserInput extends PartialType(RegisterUserInput) {
  @IsString()
  @IsOptional()
  role?: RoleType;
}
export class UpdatePhoneInput {
  @IsMobilePhone()
  phone: string;
}
