import { Body, Controller, Get, Inject, Post, Req, UseGuards } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { AuthGuard } from '../common/auth.guard';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authClient: ClientProxy,
    @Inject('USER_SERVICE') private readonly userClient: ClientProxy,
  ) {}

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authClient.send('login', dto);
  }

  @Get('me')
  @UseGuards(AuthGuard)
  me(@Req() req: { user: { sub: number } }) {
    return this.userClient.send('findOneUser', req.user.sub);
  }
}
