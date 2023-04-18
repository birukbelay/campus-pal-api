import { User } from '../entities/user.entity';

export class UserRes {
  error: string;

  user?: User;
}
// Pagination users Response

export class PagUserRes {
  count: number;

  users: User[];
}
