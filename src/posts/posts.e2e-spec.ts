import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from 'src/app.module';

describe('Posts E2E', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule], // The module that starts the application
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should create a post', async () => {
    const createPostInput = {
      title: 'Test Post Title',
      content: 'Test Post Content',
    };
    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: `
                    mutation {
                        createPost(createPostInput: {
                            title: "${createPostInput.title}",
                            content: "${createPostInput.content}"
                        }) {
                            id
                            title
                            content
                        }
                    }
                `,
      })
      .expect(200);
    expect(response.body.data.createPost.title).toEqual(createPostInput.title);
    expect(response.body.data.createPost.content).toEqual(
      createPostInput.content,
    );
  });

  it('should fetch all posts', async () => {
    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: `
                query {
                    findAllPosts {
                        id
                        title
                        content
                    }
                }
            `,
      })
      .expect(200);
    expect(response.body.data.findAllPosts).toBeInstanceOf(Array);
    expect(response.body.data.findAllPosts.length).toBeGreaterThan(0);
  });

  it('should fetch a post by ID', async () => {
    const createPostInput = {
      title: 'Test Post for Fetch',
      content: 'Content for Fetch test',
    };

    const createResponse = await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: `
                mutation {
                    createPost(createPostInput: {
                        title: "${createPostInput.title}",
                        content: "${createPostInput.content}"                 
                    }) {
                        id
                        title
                        content    
                    }
                }
            `,
      })
      .expect(200);
    const createdPost = createResponse.body.data.createPost;

    const fetchResponse = await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: `
                    query {
                        findPostById(id: "${createdPost.id}") {
                            id
                            title
                            content                        
                        }
                    }
                `,
      })
      .expect(200);

    expect(fetchResponse.body.data.findPostById).toEqual(createdPost);
  });

  it('should update a post', async () => {
    const createPostInput = {
      title: 'Post to Update',
      content: 'Initial Content',
    };

    const createResponse = await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: `
                mutation {
                    createPost(createPostInput: {
                        title: "${createPostInput.title}",
                        content: "${createPostInput.content}",
                    }) {
                        id
                        title
                        content    
                    }
                }
            `,
      })
      .expect(200);

    const createdPost = createResponse.body.data.createPost;

    const updatePostInput = {
      title: 'Updated Post Title',
      content: 'Updated Content',
    };

    const updateResponse = await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: `
                    mutation {
                        updatePost(updatePostInput: {
                            id: "${createdPost.id}",
                            title: "${updatePostInput.title}",
                            content: "${updatePostInput.content}"                        
                        }) {
                            id
                            title
                            content    
                        }                  
                    }
                `,
      })
      .expect(200);
    expect(updateResponse.body.data.updatePost.title).toEqual(
      updatePostInput.title,
    );
    expect(updateResponse.body.data.updatePost.content).toEqual(
      updatePostInput.content,
    );
  });

  it('should delete a post', async () => {
    const createPostInput = {
      title: 'Post to Delete',
      content: 'Content to Delete',
    };

    const createResponse = await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: `
                mutation {
                    createPost(createPostInput: {
                        title: "${createPostInput.title}",
                        content: "${createPostInput.content}"                    
                    }) {
                        id
                        title
                        content   
                    }
                }
            `,
      })
      .expect(200);
    const createdPost = createResponse.body.data.createPost;

    const deleteResponse = await request(app.getHttpServer())
      .post('/graphl')
      .send({
        query: `
                mutation {
                    removePost(id: "${createdPost.id}") {
                        id
                    }
                }
            `,
      })
      .expect(200);
    expect(deleteResponse.body.data.removePost.id).toEqual(createdPost.id);
  });
});
