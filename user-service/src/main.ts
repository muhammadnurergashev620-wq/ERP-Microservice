// main.ts ConfigModule'dan oldin ishlaydi, shuning uchun .env ni shu yerda yuklaymiz
try {
  process.loadEnvFile();
} catch {}

import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const host = process.env.HOST ?? 'localhost';
  const port = Number(process.env.PORT ?? 4003);

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.TCP,
      options: { host, port },
    },
  );

  await app.listen();
}

bootstrap();
