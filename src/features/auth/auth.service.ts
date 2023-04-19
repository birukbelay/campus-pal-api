import { BadRequestException, Injectable } from '@nestjs/common';
import { Request } from 'express';
//-common
//providers
import {
  CryptoService,
  ErrConst,
  logTrace,
  User,
  UserFromToken,
  UserRes,
  VerificationService,
} from './auth.dependencies';

//--self
import { AuthToken } from './dto/auth.response.dto';
import { LoginUserInput, ResetPasswordInput } from './dto/auth.input.dto';

//providers
import { CustomJwtService } from './auth.dependencies';
import { EnvConfigs } from './auth.dependencies';

//- users
import { UserService } from './auth.dependencies';

import { RegisterUserInput } from './auth.dependencies';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,

    private jwtService: CustomJwtService,
    private cryptoService: CryptoService,
    private verificationService: VerificationService, //TODO initialize ConfigTypes here
  ) {}

  //AS-1.1:registerWithEmailCode - check user exist, - generate code & create user with that code, - send verification via email
  public async registerWithEmailCode(
    input: RegisterUserInput,
  ): Promise<boolean> {
    try {
      logTrace('found user-',"--");
      // TODO ! dependent on the app
      const user = await this.usersService.findOne({
        phone: input.phone,
        active: true,
      });
      logTrace('found user-', user);
      if(user){
        return true
      }
      
      input.password = await this.cryptoService.createHash(input.password);
      //if the user already exist we will make this empty
      let copyInput: any = { ...input };
      //If the user
      // if (user) {
      //   if (user.verificationCodeExpires > Date.now())
      //     // if it has not expired
      //     return true;
      //   copyInput = {};
      // }

      const code = this.cryptoService.randomCode();
      const codeHash = await this.cryptoService.createHash(code);

      // save the hashed value of the Code and set its expire time now + 30 min
      const usr = await this.usersService.createOne(
        
        {
          ...copyInput,
          verificationCodeHash: codeHash,
          verificationCodeExpires: Date.now() + 1000 * 60 * 45, // 45 minutes
        },
      );
      if (!usr) {
        return false;
      }
      logTrace('upserted user', usr);

      // send verification email with the code
      const emRes = await this.verificationService.sendVerificationCode(
        input.phone,
        code,
      );

      return true;
    } catch (e) {
      throw new BadRequestException('Internal Server Error');
    }
  }

  //AS-1.2: - checks user exists, - check if the hash of codes matches & is not expired, - activates user
  public async activateAccountByCode(
    phoneOrEmail: string,
    code: string,
  ): Promise<UserRes> {
    const verified = await this.verifyCode(phoneOrEmail, code);
    if (!verified) {
      throw new BadRequestException(`Code is wrong Or Have Expired`);
    }
    if (verified.active == true) {
      return {
        error: ErrConst.USER_EXISTS,
        user: null,
      };
    }
    // TODO! FIXME !: depend on the project Phone Or email
    const updatedUser = await this.usersService.updateOne(
      { phone: phoneOrEmail },
      {
        active: true,
      },
    );
    // await this.emailService.sendWelcome(newUser.email)
    return { error: '', user: updatedUser };
  }

  //Au.S-1.2.1
  async verifyCode(phoneOrEmail: string, code: string): Promise<User> {
    const user = await this.usersService.userExists(phoneOrEmail);
    // const user = await this.usersService.findOneWithPwd({ email });
    if (!user) return null;

    const isMatch = await this.cryptoService.verifyHash(
      user.verificationCodeHash,
      code,
    );
    if (!isMatch || user.verificationCodeExpires < Date.now()) {
      return null;
    }
    user.verificationCodeHash = '';
    user.password = '';
    return user;
  }

  //Au.S-2
  async login(input: LoginUserInput) {
    const user: User = await this.loginValidateUser(input);
    if (!user) throw new BadRequestException('Invalid credentials');

    //generate authentication Tokens

    const authToken: AuthToken = await this.generateAuthToken({
      _id: user._id,
      role: user.role,
    });
    if (!authToken) {
      return null;
    }

    return { authToken, user };
  }

  //Au.S-2.1
  async loginValidateUser(input: LoginUserInput): Promise<User> {
    const { phoneOrEmail, password } = input;
    const user = await this.usersService.userExists(phoneOrEmail);
    // Check password hash
    const isMatch = await this.cryptoService.verifyHash(
      user.password,
      password,
    );
    if (!isMatch) return null;
    user.password = '';
    user.verificationCodeHash = '';
    return user;
  }

  //Au.S-2.2:  generate auth & refresh
  public async generateAuthToken(payload: UserFromToken): Promise<AuthToken> {
    const sessionId = this.cryptoService.randomCode();
    const newPayload: UserFromToken = {
      _id: payload._id,
      sessionId,
      role: payload.role,
    };
    payload.sessionId = sessionId;
    // const envJwt = envConfig().jwt

    const accessToken = await this.jwtService.signAccessToken(newPayload);
    const refreshToken = await this.jwtService.signRefreshToken(newPayload);

    const authToken: AuthToken = {
      accessToken,
      refreshToken,
      sessionId,
    };
    const hashedRefreshToken = await this.cryptoService.createHash(
      authToken.refreshToken,
    );
    //Update users hashed tokens
    const usr = await this.usersService.upsertOne(
      { _id: payload._id },
      {
        hashedRefreshToken,
      },
    );
    if (usr.modifiedCount < 1) {
      return null;
    }

    return authToken;
  }

  // Au.S-3.1
  async logOut(token: string): Promise<boolean> {
    const user: UserFromToken = await this.getUserFromRefreshToken(token);
    logTrace('userFromRef', user);
    if (!user) {
      return false;
    }

    const userRes = await this.usersService.upsertOne(
      { _id: user._id },
      { hashedRefreshToken: '' },
    );
    if (userRes.modifiedCount < 1) {
      return false;
    }
    return true;
  }

  //AS-12.1:
  async resetTokens(resetToken: string) {
    //  1. verify the refresh token
    const user = await this.getUserFromRefreshToken(resetToken);
    if (!user) return null;

    //  2. generate new refresh token
    return await this.generateAuthToken({
      _id: user._id,
      role: user.role,
    });
  }

  //  ------------------------   AUTHORIZATION OPERATIONS

  public async getUserFromToken(token: string): Promise<User | null> {
    if (!token) return null;
    logTrace('token ', token);
    const decoded = (await this.jwtService.verifyAccessToken(
      token,
    )) as UserFromToken;
    if (!decoded || !decoded?._id) return null;
    logTrace('token Verified', decoded);
    const realUser: User = await this.usersService.findById(decoded._id);
    if (!realUser) return null;
    return realUser;
  }

  // when users access token experis, verifies users refresh token & returns the refresh token
  //AS-12.1.1
  public async getUserFromRefreshToken(
    refreshToken: string,
  ): Promise<UserFromToken | null> {
    if (!refreshToken) return null;
    //verify the refresh token
    const decoded = (await this.jwtService.verifyRefreshToken(
      refreshToken,
    )) as UserFromToken;
    if (!decoded || !decoded._id) return null;
    // find the User from database
    const user: User = await this.usersService.findOneWithPwd({
      _id: decoded._id,
    });
    if (!user) return null;

    //compare the hashed refresh token and the users refresh token
    const isRefreshTokenMatching = await this.cryptoService.verifyHash(
      user.hashedRefreshToken,
      refreshToken,
    );
    if (!isRefreshTokenMatching) return null;
    return decoded;
  }
}
