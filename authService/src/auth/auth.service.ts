import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import * as bcrypt from 'bcrypt';
import { firstValueFrom } from 'rxjs';
import { LoginDto } from './dto/login.dto';

interface UserRecord {
  id: number;
  username: string;
  phone: string;
  password: string;
  role: string;
}

@Injectable()
export class AuthService {
  constructor(
    @Inject('USER_SERVICE') private readonly userClient: ClientProxy,
    private readonly jwt: JwtService,
  ) {}

  async login({ username, password }: LoginDto) {
    const user = await this.findUser(username);
    const valid = user && (await bcrypt.compare(password, user.password));
    if (!user || !valid) {
      throw new RpcException({
        statusCode: 401,
        message: 'Invalid username or password',
      });
    }

    const payload = { sub: user.id, username: user.username, role: user.role };
    return {
      accessToken: await this.jwt.signAsync(payload),
      user: {
        id: user.id,
        username: user.username,
        phone: user.phone,
        role: user.role,
      },
    };
  }

  async verifyToken(token: string) {
    try {
      return await this.jwt.verifyAsync<{
        sub: number;
        username: string;
        role: string;
      }>(token);
    } catch {
      throw new RpcException({
        statusCode: 401,
        message: 'Invalid or expired token',
      });
    }
  }

  private async findUser(username: string): Promise<UserRecord | null> {
    try {
      return await firstValueFrom(
        this.userClient.send<UserRecord>('findUserByUsername', username),
      );
    } catch (err: any) {
      // user topilmasa 401 qaytaramiz, boshqa xatolar o'z holicha
      if (err?.statusCode === 404) return null;
      throw new RpcException(err);
    }
  }
}
