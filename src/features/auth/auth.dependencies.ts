// common

export {
  ColorEnums as ColorEnums,
  logTrace as logTrace,
} from '../../common/logger';
export { RoleType as RoleType } from '../../common/common.types';
export { EnvConfigs as EnvConfigs } from '../../common/config/config.instances';

export { ErrConst as ErrConst } from '../../common/constants';
export {
  HttpContext as HttpContext,
  UserFromToken as UserFromToken,
} from '../../common/common.types';

//providers
export { JwtGuard as JwtGuard } from '../../providers/guards/guard.rest';
export { Roles as Roles } from '../../providers/guards/roles.decorators';
export { CryptoService as CryptoService } from '../../providers/crypto/crypto.service';
export { CustomJwtService } from '../../providers/crypto/jwt.service';
export { VerificationService as VerificationService } from '../../providers/verification';
//Modules
export { UsersModule as UsersModule } from '../users/users.module';
export { VerificationModule as VerificationModule } from '../../providers/verification/verification.module';
export { CryptoModule as CryptoModule } from '../../providers/crypto/crypto.module';
export { GuardsModule as GuardsModule } from '../../providers/guards/guards.module';
//== Users
//--users.dto
export {
  RegisterUserInput as RegisterUserInput,
  UserRes as UserRes,
} from '../users';
//--users.entity
export {
  User as User,
  UserSchema as UserSchema,
  emailRegex as emailRegex,
} from '../users';
export { UserService as UserService } from '../users';
