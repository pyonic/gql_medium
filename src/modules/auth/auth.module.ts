import { Module } from '@nestjs/common';
import { UserModule } from '../users/user.module';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { AuthResolver } from './auth.resolver';

@Module({
  imports: [UserModule],
  providers: [AuthService, PrismaService, AuthResolver],
})
export class AuthModule {}
