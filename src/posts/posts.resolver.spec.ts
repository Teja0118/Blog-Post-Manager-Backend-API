import { Test, TestingModule } from '@nestjs/testing';
import { PostsResolver } from './posts.resolver';
import { PostsService } from './posts.service';
// import { Post } from './schemas/post.schema';
import { CreatePostInput } from './dto/create-post.input';
import { UpdatePostInput } from './dto/update-post.input';

describe('PostsResolver', () => {
  let resolver: PostsResolver;
  let service: PostsService;

  const mockPost = {
    id: '1',
    title: 'Test Post',
    content: 'Test Content',
  };

  const mockPostsService = {
    create: jest.fn().mockResolvedValue(mockPost),
    findAll: jest.fn().mockResolvedValue([mockPost]),
    findOne: jest.fn().mockResolvedValue(mockPost),
    update: jest.fn().mockResolvedValue(mockPost),
    remove: jest.fn().mockResolvedValue(mockPost),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostsResolver,
        {
          provide: PostsService,
          useValue: mockPostsService,
        },
      ],
    }).compile();
    resolver = module.get<PostsResolver>(PostsResolver);
    service = module.get<PostsService>(PostsService);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  it('should create a post', async () => {
    const createPostInput: CreatePostInput = {
      title: 'New Post',
      content: 'Post Content',
    };
    const result = await resolver.createPost(createPostInput);
    expect(result).toEqual(mockPost);
    expect(service.create).toHaveBeenCalled();
  });

  it('should return all posts', async () => {
    const result = await resolver.findAllPosts();
    expect(result).toEqual([mockPost]);
    expect(service.findAll).toHaveBeenCalled();
  });

  it('should return a post by Id', async () => {
    const result = await resolver.findPostById('1');
    expect(result).toEqual(mockPost);
    expect(service.findOne).toHaveBeenCalledWith('1');
  });

  it('should update a post', async () => {
    const updatePostInput: UpdatePostInput = {
      id: '1',
      title: 'Updated Post',
    };
    const result = await resolver.updatePost(updatePostInput);
    expect(result).toEqual(mockPost);
    expect(service.update).toHaveBeenCalledWith('1', updatePostInput);
  });

  it('should delete a post', async () => {
    const result = await resolver.removePost('1');
    expect(result).toEqual(mockPost);
    expect(service.remove).toHaveBeenCalledWith('1');
  });
});
