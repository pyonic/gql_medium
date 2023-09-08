import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../users/user.service';
import { PrismaService } from '../prisma/prisma.service';
import { RefreshTokens, Role, User } from '@prisma/client';
import { config } from 'dotenv';
import { LoginUserInput } from './dto/login-user.input';
import {
  ACCESS_TOKEN_LIFETIME,
  REFRESH_TOKEN_LIFETIME,
} from 'src/constants/indext';
import { TokensPair } from './interfaces/auth.interface';

config();

const JWT_SECRET = process.env.JWT_ACCESS_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {}

  async signUp(createUserDto: any): Promise<TokensPair> {
    const userExists: User = await this.usersService.findByEmail(
      createUserDto.email,
    );

    if (userExists) {
      throw new BadRequestException('User already exists');
    }

    const hash: string = await this.hashData(createUserDto.password);

    if (!createUserDto.role) createUserDto.role = Role.user;

    const newUser: User = await this.prisma.user.create({
      data: {
        ...createUserDto,
        password: hash,
      },
    });

    const tokens: TokensPair = await this.getTokens(newUser);

    await this.updateRefreshToken(newUser.email, tokens.refreshToken);

    return tokens;
  }

  async signIn(data: LoginUserInput): Promise<TokensPair> {
    const user: User = await this.usersService.findByEmail(data.email);

    if (!user) {
      throw new UnauthorizedException('Password or email is incorrect');
    }

    const passwordMatches = await argon2.verify(user.password, data.password);

    if (!passwordMatches) {
      throw new UnauthorizedException('Password or email is incorrect');
    }

    const tokens: TokensPair = await this.getTokens(user);

    await this.updateRefreshToken(user.email, tokens.refreshToken);
    return tokens;
  }

  hashData(data: string): Promise<string> {
    return argon2.hash(data);
  }

  async updateRefreshToken(email: string, refreshToken: string) {
    const hashedRefreshToken: string = await this.hashData(refreshToken);

    await this.prisma.refreshTokens.deleteMany({
      where: { email },
    });

    await this.prisma.refreshTokens.create({
      data: { email, token: hashedRefreshToken },
    });
  }

  async getTokens(user: User): Promise<TokensPair> {
    const { id, email, role } = user;
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        { id, role, email },
        {
          secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
          expiresIn: ACCESS_TOKEN_LIFETIME,
        },
      ),
      this.jwtService.signAsync(
        { id, role, email },
        {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
          expiresIn: REFRESH_TOKEN_LIFETIME,
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async refreshTokens(refreshToken: string): Promise<TokensPair> {
    const payload: Partial<User> = await this.verifyToken(
      refreshToken,
      JWT_REFRESH_SECRET,
    );

    const { email } = payload;

    const refresh_data: RefreshTokens =
      await this.prisma.refreshTokens.findFirst({
        where: { email },
      });

    if (!refresh_data || !refresh_data.token)
      throw new ForbiddenException('Access Denied');

    const refreshTokenMatches = await argon2.verify(
      refresh_data.token,
      refreshToken,
    );

    if (!refreshTokenMatches) throw new ForbiddenException('Access Denied');

    const user: User = await this.usersService.findByEmail(refresh_data.email);

    const tokens: TokensPair = await this.getTokens(user);

    await this.updateRefreshToken(user.email, tokens.refreshToken);

    return tokens;
  }

  async verifyToken(
    token: string,
    secret: string = JWT_SECRET,
  ): Promise<Partial<User>> {
    return await this.jwtService.verifyAsync(token, {
      secret,
    });
  }
}
