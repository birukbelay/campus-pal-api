import { PaginationInputs, RoleType } from '../common.types';

export class PaginationInput implements PaginationInputs {
  limit?: number;
  page?: number;
}

export class MessageError {
  message: string;
  code: string;
}
