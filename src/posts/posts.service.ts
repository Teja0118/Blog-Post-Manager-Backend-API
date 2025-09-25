import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post, PostDocument } from './schemas/post.schema';
import { CreatePostInput } from './dto/create-post.input';
import { UpdatePostInput } from './dto/update-post.input';

@Injectable()
export class PostsService {
  constructor(@InjectModel(Post.name) private postModel: Model<PostDocument>) {}

  // Create a post
  async create(createPostInput: CreatePostInput): Promise<Post> {
    const createdPost = new this.postModel(createPostInput);
    return createdPost.save();
  }

  // Find all posts
  async findAll(): Promise<Post[]> {
    return this.postModel.find();
  }

  // Find post by ID
  async findOne(id: string): Promise<Post> {
    return this.postModel.findById(id);
  }

  // Update a Post by ID
  async update(id: string, updatePostInput: UpdatePostInput): Promise<Post> {
    return this.postModel.findByIdAndUpdate(id, updatePostInput, { new: true });
  }

  // Remove a Post by ID
  async remove(id: string): Promise<Post> {
    return this.postModel.findByIdAndDelete(id);
  }
}
