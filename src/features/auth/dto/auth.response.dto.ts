import { User } from '../auth.dependencies';

//Auth-token.object-types

export class AuthToken {
  accessToken?: string;

  refreshToken?: string;

  sessionId?: string;
}

export class AuthTokenResponse {
  authToken?: AuthToken;

  user?: User;
}

export class TokenResponse {
  token?: string;
}
