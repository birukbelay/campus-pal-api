// import { UserExitsValidator } from '@common/decorators/user-exists.validator'
import {
  IsBoolean,
  IsMobilePhone,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';

export class TokenInput {
  @IsString()
  @IsNotEmpty()
  token: string;
}
export class LoginUserInput {
  @IsString()
  @IsNotEmpty()
  phoneOrEmail: string;

  @IsString()
  @MinLength(3)
  password: string;
}

// User change password directly on website

export class ChangePasswordInput {
  @IsString()
  oldPassword: string;

  @MinLength(6)
  @IsString()
  newPassword: string;
}

// user's input when verifying token to change password
export class ResetPasswordInput {
  @IsString()
  email: string;

  @IsString()
  code: string;

  @MinLength(6)
  @IsString()
  newPassword: string;

  @IsBoolean()
  resetAllSessions: boolean;
}

export class RequestForgotPasswordInput {
  @IsMobilePhone()
  phone: string;
}
