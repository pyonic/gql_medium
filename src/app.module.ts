import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/users/user.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './modules/prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { PostModule } from './modules/posts/post.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './common/guards/auth.guard';
import { ComplexityPlugin } from './common/plugins/complexity.plugin';
import { UserService } from './modules/users/user.service';
import { createUsersLoader } from './modules/dataloader/users.loader';
import {
  postsLoader,
  userPostsLoader,
} from './modules/dataloader/posts.loader';
import { PostService } from './modules/posts/post.service';
import {
  postViewsLoader,
  userViewsLoader,
} from './modules/dataloader/views.loader';
import { CustomHttpPlugin } from './common/plugins/gql-response.plugin';

@Module({
  imports: [
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      imports: [UserModule, PostModule],
      useFactory: (usersService: UserService, postsService: PostService) => ({
        autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
        context: ({ req }) => ({
          request: req,
          usersLoader: createUsersLoader(usersService),
          userPostsLoader: userPostsLoader(postsService),
          postsLoader: postsLoader(postsService),
          postViewsLoader: postViewsLoader(postsService),
          userViewsLoader: userViewsLoader(postsService),
        }),
        formatError: (error: any) => {
          const graphQLFormattedError = {
            message:
              error.extensions?.exception?.response?.message || error.message,
            statusCode: error.extensions?.originalError?.statusCode || 500,
          };
          return graphQLFormattedError;
        },
        plugins: [CustomHttpPlugin],
      }),

      inject: [UserService, PostService],
    }),
    JwtModule.register({
      global: true,
    }),
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    UserModule,
    PrismaModule,
    PostModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    ComplexityPlugin,
  ],
  controllers: [],
})
export class AppModule {}
