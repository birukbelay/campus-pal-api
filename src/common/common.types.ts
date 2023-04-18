import { Request, Response } from 'express';

export interface HttpContext {
  req: Request;
  res: Response;
}

export interface PayloadUserForJwtToken {
  user: UserFromToken;
}

export interface PaginationInputs {
  limit?: number;

  page?: number;
}

export enum RoleType {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

export class UserFromToken {
  _id?: string;
  role?: RoleType;
  sessionId?: string;
}

// --------------------          Unused
export interface SessionAuthToken {
  authToken?: IAuthToken;
}
export interface IAuthToken {
  accessToken?: string;
  refreshToken?: string;
}

// export interface UserFromRequest extends Partial<UserI> {
//   _id?: string
//   role?: RoleType
//   email?: string
//   phone?: string
//   password?: string
//   avatar?: string
//   sessionId?:string
// }
// export interface PayloadUserTokenSignup  {
//   user: UserFromRequest
// }
