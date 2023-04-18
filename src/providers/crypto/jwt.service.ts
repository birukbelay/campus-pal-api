import { Injectable } from '@nestjs/common';

import { verify, JwtPayload, sign } from 'jsonwebtoken';

import { ConfigTypes } from '../../common/config/configTypes';
import { EnvConfigs } from '../../common/config/config.instances';
import { logTrace } from '../../common/logger';

@Injectable()
export class CustomJwtService {
  private _envConfig: ConfigTypes;
  constructor() {
    this._envConfig = EnvConfigs;
  }

  // =============== Any other Token, user provides the secret & payload type
  public async signJwtToken(payload: any, secret: string, options) {
    return sign(payload, secret, options);
  }

  public async verifyJwtToken(token: string, secret: string) {
    return verify(token, secret, {
      algorithms: ['HS256'],
    }) as JwtPayload;
  }
  // =====================   Access & refresh Tokens
  public async signAccessToken(payload: any) {
    const token = sign(payload, this._envConfig.jwt.jwtAccessSecret, {
      expiresIn: this._envConfig.jwt.jwtAccessExpiredTime,
      algorithm: 'HS256',
    });
    return `Bearer ${token}`;
  }

  public async verifyAccessToken(authorization: string) {
    const [_, token] = authorization.split(' ');
    logTrace('Access Token==', token);
    const decoded = await verify(token, this._envConfig.jwt.jwtAccessSecret, {
      algorithms: ['HS256'],
      complete: true,
    });
    return decoded.payload;
    // return jwt.verify(token, this._envConfig.jwt.jwtAccessSecret, {
    //   algorithms: ['HS256'],
    //   complete: true
    // })
  }

  public async signRefreshToken(payload: any) {
    const token = sign(payload, this._envConfig.jwt.jwtRefreshSecret, {
      expiresIn: this._envConfig.jwt.jwtRefreshExpiredTime,
      algorithm: 'HS256',
    });

    return `Bearer ${token}`;
  }

  public async verifyRefreshToken(authorization: string) {
    const [_, token] = authorization.split(' ');
    return verify(token, this._envConfig.jwt.jwtRefreshSecret, {
      algorithms: ['HS256'],
    });
  }
}
