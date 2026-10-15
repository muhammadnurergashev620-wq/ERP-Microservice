import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';

const tcpClient = (name: string, prefix: string) => ({
  name,
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (config: ConfigService) => ({
    transport: Transport.TCP as const,
    options: {
      host: config.get<string>(`${prefix}_HOST`) ?? 'localhost',
      port: Number(config.get(`${prefix}_PORT`)),
    },
  }),
});

@Global()
@Module({
  imports: [
    ClientsModule.registerAsync([
      tcpClient('USER_SERVICE', 'USER_SERVICE'),
      tcpClient('AUTH_SERVICE', 'AUTH_SERVICE'),
    ]),
  ],
  exports: [ClientsModule],
})
export class ClientsGlobalModule {}
