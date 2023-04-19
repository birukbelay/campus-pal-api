import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  BadRequestException,
  Headers,
  UseGuards,
  Req,
} from '@nestjs/common';

import { AuthService } from './auth.service';
import { RegisterUserInput, UpdateUserInput, UserRes } from '../users';
import {
  UpdateMeDto,
  UpdateUserWithRole,
} from '../users/dto/user.mut.dto';
import { LoginUserInput, TokenInput , VerifyCodeInput} from './dto/auth.input.dto';
import { AuthTokenResponse } from './dto/auth.response.dto';
import {
  JwtGuard,
  logTrace,
  Roles,
  RoleType,
  User,
  UserFromToken,
} from './auth.dependencies';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  //Au.R-1.1 RegisterAndSendCode
  @Post('signup')
  registerAndSendCode(@Body() input: RegisterUserInput) {
    return this.authService.registerWithEmailCode(input);
  }
  //Au.R-1.2 AcivateRegistration
  @Post('activate')
  async activateWithCode(@Body() input: VerifyCodeInput) {
    const userResponse = await this.authService.activateAccountByCode(
      input.phoneOrEmail,
      input.code,
    );
    if (!userResponse) throw new BadRequestException('Code is not valid');
    return userResponse;
  }
  //Au.R-2 Login
  @Post('login')
  async login(@Body() input: LoginUserInput): Promise<AuthTokenResponse> {
    const res = await this.authService.login(input);
    return res;
  }
  //Au.R-3 Logout
  @Post('logout')
  async logOut(@Body() input: TokenInput): Promise<boolean> {
    return this.authService.logOut(input.token);
  }

  //Au.R-4 resetTokens
  @Post('resetTokens')
  async resetTokens(@Body() input: TokenInput): Promise<AuthTokenResponse> {
    const authToken = await this.authService.resetTokens(input.token);
    return { authToken };
  }
  // Au.R-6 Update user
  @Get('me')
  async me(
    @Headers('authorization') header: string,
    @Req() req: Request,
  ): Promise<UserRes> {
    const authHeader = req.headers['authorization'];
    logTrace(header, authHeader);
    const user = await this.authService.getUserFromToken(authHeader);

    if (!user) return { user: null, error: 'No user found' };
    return { user, error: null };
  }
  //Au.R-6 Update user
  @Patch('me/:id')
  @UseGuards(JwtGuard)
  @Roles(RoleType.ADMIN)
  async updateMe(@Body() input: UpdateMeDto): Promise<UpdateUserWithRole> {
    return {};
  }
}
