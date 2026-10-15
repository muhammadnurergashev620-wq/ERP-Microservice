import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { AuthGuard } from '../common/auth.guard';
import { Roles } from '../common/roles.decorator';
import { CreateUserDto, UserRole } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
@UseGuards(AuthGuard)
@Roles(UserRole.DIRECTOR, UserRole.ADMIN)
export class UserController {
  constructor(
    @Inject('USER_SERVICE') private readonly userClient: ClientProxy,
  ) {}

  @Post()
  create(@Body() dto: CreateUserDto) {
    return this.userClient.send('createUser', dto);
  }

  @Get()
  findAll() {
    return this.userClient.send('findAllUser', {});
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.userClient.send('findOneUser', id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateUserDto) {
    return this.userClient.send('updateUser', { ...dto, id });
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.userClient.send('removeUser', id);
  }
}
