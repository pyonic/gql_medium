import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { PrismaModule } from '../prisma/prisma.module';
import { PrismaService } from '../prisma/prisma.service';
import { UserResolver } from './user.resolver';
import { PostModule } from '../posts/post.module';
import { PostService } from '../posts/post.service';

@Module({
  imports: [PrismaModule, PostModule],
  controllers: [],
  providers: [UserService, PrismaService, UserResolver, PostService],
  exports: [UserService],
})
export class UserModule {}
