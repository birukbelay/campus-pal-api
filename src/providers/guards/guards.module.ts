import { Module } from '@nestjs/common';
import { JwtGuard } from './guard.rest';

import { CryptoModule } from '../crypto/crypto.module';

@Module({
  imports: [CryptoModule],
  providers: [JwtGuard],
  exports: [JwtGuard],
})
export class GuardsModule {}
