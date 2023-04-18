// Export items of this module

export { User as User, UserSchema as UserSchema } from './entities/user.entity';
export { emailRegex as emailRegex } from './entities/user.entity';

export { UserService as UserService } from './users.service';

export {
  UpdateMeDto as UpdateProfileInput,
  UpdatePhoneInput as UpdatePhoneInput,
  RegisterUserInput as RegisterUserInput,
  UpdateUserWithRole as UpdateUserInput,
} from './dto/user.mut.dto';
export { UserWhereUniqueInput as UserWhereUniqueInput } from './dto/usr.qu.input';
export {
  UserRes as UserRes,
  PagUserRes as PagUserRes,
} from './dto/resp.user.dto';
