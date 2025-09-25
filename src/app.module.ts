import { Module } from '@nestjs/common';
// import { MongooseModule } from '@nestjs/mongoose';
import { GraphQLModule } from './graphql/graphql.module';
import { PostsModule } from './posts/posts.module';
import { MongoModule } from './mongoose/mongoose.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [MongoModule, GraphQLModule, PostsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
