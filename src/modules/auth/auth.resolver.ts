import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { LoginUserResponse } from './dto/login-user.response';
import { LoginUserInput } from './dto/login-user.input';
import { RegisterUserInput } from './dto/register-user.input';
import { RefreshTokenInput } from './dto/refresh-token.input';
import { Public } from 'src/common/decorators/public.decorator';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Mutation(() => LoginUserResponse, { name: 'login' })
  async login(
    @Args('loginUserInput') loginUserInput: LoginUserInput,
  ): Promise<LoginUserResponse> {
    return this.authService.signIn(loginUserInput);
  }

  @Mutation(() => LoginUserResponse, { name: 'register' })
  async register(
    @Args('registerUserInput') registerUserInput: RegisterUserInput,
  ): Promise<LoginUserResponse> {
    return this.authService.signUp(registerUserInput);
  }

  @Public()
  @Mutation(() => LoginUserResponse, { name: 'refresh' })
  async refresh(@Args('refreshInput') refreshInput: RefreshTokenInput) {
    return this.authService.refreshTokens(refreshInput.refresh_token);
  }
}
