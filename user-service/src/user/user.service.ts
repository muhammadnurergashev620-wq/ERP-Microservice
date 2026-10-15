import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

const SALT_ROUNDS = 10;

// parol hash'i tashqariga chiqmasligi uchun
const safeSelect = {
  id: true,
  username: true,
  phone: true,
  role: true,
  createdAt: true,
  updatedAt: true,
} as const;

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    await this.ensureUnique(createUserDto.username, createUserDto.phone);
    const password = await bcrypt.hash(createUserDto.password, SALT_ROUNDS);
    return this.prisma.user.create({
      data: { ...createUserDto, password },
      select: safeSelect,
    });
  }

  findAll() {
    return this.prisma.user.findMany({
      select: safeSelect,
      orderBy: { id: 'asc' },
    });
  }

  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: safeSelect,
    });
    if (!user) throw this.notFound();
    return user;
  }

  async findByUsername(username: string) {
    const user = await this.prisma.user.findUnique({ where: { username } });
    if (!user) throw this.notFound();
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const current = await this.prisma.user.findUnique({ where: { id } });
    if (!current) throw this.notFound();

    const { id: _id, ...data } = updateUserDto;
    await this.ensureUnique(
      data.username !== current.username ? data.username : undefined,
      data.phone !== current.phone ? data.phone : undefined,
    );
    if (data.password) {
      data.password = await bcrypt.hash(data.password, SALT_ROUNDS);
    }
    return this.prisma.user.update({ where: { id }, data, select: safeSelect });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.user.delete({ where: { id }, select: safeSelect });
  }

  private async ensureUnique(username?: string, phone?: string) {
    if (username) {
      const exist = await this.prisma.user.findUnique({ where: { username } });
      if (exist) {
        throw new RpcException({
          statusCode: 409,
          message: 'Username already exists',
        });
      }
    }
    if (phone) {
      const exist = await this.prisma.user.findUnique({ where: { phone } });
      if (exist) {
        throw new RpcException({
          statusCode: 409,
          message: 'Phone already exists',
        });
      }
    }
  }

  private notFound() {
    return new RpcException({ statusCode: 404, message: 'User not found' });
  }
}
