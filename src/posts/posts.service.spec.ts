import { Test, TestingModule } from '@nestjs/testing';
import { PostsService } from './posts.service';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post } from './schemas/post.schema';
import { CreatePostInput } from './dto/create-post.input';

describe('PostsService', () => {
  let service: PostsService;
  let postModel: Model<Post>;

  const mockPost = {
    id: '1',
    title: 'Test Post',
    content: 'Test Content',
  };

  const mockPostModel = {
    constructor: jest.fn().mockImplementation(() => mockPost), // Mocking the constructor
    save: jest.fn().mockResolvedValue(mockPost),
    find: jest.fn().mockResolvedValue([mockPost]),
    findById: jest.fn().mockResolvedValue(mockPost),
    findByIdAndUpdate: jest.fn().mockResolvedValue(mockPost),
    findByIdAndDelete: jest.fn().mockResolvedValue(mockPost),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostsService,
        {
          provide: getModelToken(Post.name),
          useValue: mockPostModel, // Use the mocked model
        },
      ],
    }).compile();
    service = module.get<PostsService>(PostsService);
    postModel = module.get<Model<Post>>(getModelToken(Post.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a post', async () => {
    const createPostInput: CreatePostInput = {
      title: 'New Post',
      content: 'Post Content',
    };
    const result = await service.create(createPostInput);
    expect(result).toEqual(mockPost);
    //expect(postModel.save).toHaveBeenCalledWith(createPostInput);
  });

  it('should find all posts', async () => {
    const result = await service.findAll();
    expect(result).toEqual([mockPost]);
    expect(postModel.find).toHaveBeenCalled();
  });

  it('should find one post by ID', async () => {
    const result = await service.findOne('1');
    expect(result).toEqual(mockPost);
    expect(postModel.findById).toHaveBeenCalledWith('1');
  });

  it('should update a post', async () => {
    const updatePostInput = { id: '1', title: 'Updated Title' };
    const result = await service.update(updatePostInput.id, updatePostInput);
    expect(result).toEqual(mockPost);
    expect(postModel.findByIdAndUpdate).toHaveBeenCalledWith(
      '1',
      updatePostInput,
      { new: true },
    );
  });

  it('should remove a post', async () => {
    const result = await service.remove('1');
    expect(result).toEqual(mockPost);
    expect(postModel.findByIdAndDelete).toHaveBeenCalledWith('1');
  });
});
