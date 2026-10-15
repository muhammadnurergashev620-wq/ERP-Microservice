import { ClientsGlobalModule } from './common/clients.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), ClientsGlobalModule, AuthModule, UserModule],
})
export class AppModule {}
