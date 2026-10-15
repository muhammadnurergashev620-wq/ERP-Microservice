import { Roles } from '../../../generated/prisma/enums';

export class CreateUserDto {
  username!: string;
  phone!: string;
  password!: string;
  role!: Roles;
}
