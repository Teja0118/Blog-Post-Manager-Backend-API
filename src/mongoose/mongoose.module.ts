import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
// import { Mongoose } from 'mongoose';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/nestgraphqlmongo'),
  ],
})
export class MongoModule {}
