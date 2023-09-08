import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getAll(filters: any = {}): Promise<User[]> {
    const { limit = 10, page = 1 } = filters;
    const skip: number = ~~limit * ((~~page === 0 ? 1 : ~~page) - 1);
    const take: number = ~~limit;

    const users: User[] = await this.prisma.user.findMany({
      skip,
      take,
    });

    return users.map(this.mapUser);
  }

  async getUser(filter: Partial<User>): Promise<User> {
    const user: User = await this.prisma.user.findFirst({
      where: filter,
    });

    if (!user) throw new NotFoundException('User not found');

    return this.mapUser(user);
  }

  async getUserByIds(ids: Array<number>): Promise<User[]> {
    const users: User[] = await this.prisma.user.findMany({
      where: { id: { in: ids } },
    });

    return users.filter((user: User) => ids.includes(user.id));
  }

  async findByEmail(email: string): Promise<User> {
    const user: User = await this.prisma.user.findFirst({
      where: { email },
    });

    return user;
  }

  mapUser(data: User): User {
    delete data.password;
    return data;
  }
}
