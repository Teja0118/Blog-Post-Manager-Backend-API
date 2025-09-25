import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ObjectType, Field, ID } from '@nestjs/graphql';

export type PostDocument = Post & Document;

@ObjectType() // Decorator to make this a GraphQL Object Type
@Schema()
export class Post {
  @Field(() => ID) // Decorator to expose this in GraphQL
  @Prop()
  id: string;

  @Field()
  @Prop()
  title: string;

  @Field()
  @Prop()
  content: string;
}

export const PostSchema = SchemaFactory.createForClass(Post);
