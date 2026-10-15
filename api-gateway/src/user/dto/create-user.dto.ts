import { IsEnum, IsNotEmpty, IsString, Matches, MinLength } from 'class-validator';

export enum UserRole {
  DIRECTOR = 'DIRECTOR',
  ADMIN = 'ADMIN',
  TEACHER = 'TEACHER',
  STUDENT = 'STUDENT',
}

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  username!: string;

  @IsString()
  @Matches(/^\+?\d{9,15}$/, { message: 'phone must be a valid phone number' })
  phone!: string;

  @IsString()
  @MinLength(6)
  password!: string;

  @IsEnum(UserRole)
  role!: UserRole;
}
