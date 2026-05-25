/**
 * Posts API Test Suite
 * Tests for post endpoints on JSONPlaceholder API
 */

import { test, expect } from '../fixtures/api.fixture';
import { ApiAssertions } from '@api/utils/assertions';
import { CreatePostPayload, UpdatePostPayload } from '@api/models';

test.describe('📝 Posts API Tests', () => {
  test.describe('GET /posts - List all posts', () => {
    test('should retrieve all posts successfully', async ({
      jsonPlaceholder,
    }) => {
      // Act
      const response = await jsonPlaceholder.getAllPosts();

      // Assert
      ApiAssertions.assertSuccessStatus(response.status);
      ApiAssertions.assertArrayNotEmpty(response.body);
      expect(response.body.length).toBeGreaterThan(0);
    });

    test('should return posts with valid schema', async ({
      jsonPlaceholder,
    }) => {
      // Act
      const response = await jsonPlaceholder.getAllPosts();

      // Assert
      expect(response.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            userId: expect.any(Number),
            id: expect.any(Number),
            title: expect.any(String),
            body: expect.any(String),
          }),
        ])
      );
    });

    test('should return 100 posts total', async ({ jsonPlaceholder }) => {
      // Act
      const response = await jsonPlaceholder.getAllPosts();

      // Assert
      expect(response.body).toHaveLength(100);
    });
  });

  test.describe('GET /posts?_start&_limit - Pagination', () => {
    test('should retrieve paginated posts with limit', async ({
      jsonPlaceholder,
    }) => {
      // Arrange
      const page = 1;
      const limit = 10;

      // Act
      const response = await jsonPlaceholder.getPostsWithPagination(
        page,
        limit
      );

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(limit);
    });

    test('should retrieve second page of posts', async ({
      jsonPlaceholder,
    }) => {
      // Arrange
      const limit = 10;

      // Act
      const page1 = await jsonPlaceholder.getPostsWithPagination(1, limit);
      const page2 = await jsonPlaceholder.getPostsWithPagination(2, limit);

      // Assert
      expect(page1.body[0].id).not.toBe(page2.body[0].id);
      expect(page2.body[0].id).toBe(page1.body[limit - 1].id + 1);
    });

    test('should handle different page sizes', async ({
      jsonPlaceholder,
    }) => {
      // Arrange & Act
      const response5 = await jsonPlaceholder.getPostsWithPagination(1, 5);
      const response20 = await jsonPlaceholder.getPostsWithPagination(1, 20);

      // Assert
      expect(response5.body).toHaveLength(5);
      expect(response20.body).toHaveLength(20);
    });
  });

  test.describe('GET /posts/:id - Get post by ID', () => {
    test('should retrieve post by valid ID', async ({ jsonPlaceholder }) => {
      // Arrange
      const postId = 1;

      // Act
      const response = await jsonPlaceholder.getPostById(postId);

      // Assert
      ApiAssertions.assertSuccessStatus(response.status);
      expect(response.body.id).toBe(postId);
      expect(response.body.title).toBeTruthy();
      expect(response.body.body).toBeTruthy();
    });

    test('should return 404 for non-existent post', async ({
      jsonPlaceholder,
    }) => {
      // Act
      const response = await jsonPlaceholder.getPostById(999);

      // Assert
      expect(response.status).toBe(404);
    });
  });

  test.describe('GET /posts?userId= - Get posts by user', () => {
    test('should retrieve posts by user ID', async ({ jsonPlaceholder }) => {
      // Arrange
      const userId = 1;

      // Act
      const response = await jsonPlaceholder.getPostsByUserId(userId);

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(10);
      response.body.forEach((post: any) => {
        expect(post.userId).toBe(userId);
      });
    });

    test('should return all posts for each user', async ({
      jsonPlaceholder,
    }) => {
      // Arrange & Act
      for (let userId = 1; userId <= 10; userId++) {
        const response = await jsonPlaceholder.getPostsByUserId(userId);

        // Assert
        expect(response.status).toBe(200);
        expect(response.body).toHaveLength(10);
      }
    });
  });

  test.describe('POST /posts - Create post', () => {
    test('should create a new post successfully', async ({
      jsonPlaceholder,
    }) => {
      // Arrange
      const newPost: CreatePostPayload = {
        userId: 1,
        title: 'Test Post Title',
        body: 'This is a test post body',
      };

      // Act
      const response = await jsonPlaceholder.createPost(newPost);

      // Assert
      expect(response.status).toBe(201);
      expect(response.body).toEqual(
        expect.objectContaining({
          userId: newPost.userId,
          title: newPost.title,
          body: newPost.body,
          id: expect.any(Number),
        })
      );
    });

    test('should return created post with ID', async ({
      jsonPlaceholder,
    }) => {
      // Arrange
      const newPost: CreatePostPayload = {
        userId: 2,
        title: 'Another Test Post',
        body: 'Another test body',
      };

      // Act
      const response = await jsonPlaceholder.createPost(newPost);

      // Assert
      expect(response.body.id).toBe(101); // JSONPlaceholder returns 101 for new posts
    });

    test('should handle post with long content', async ({
      jsonPlaceholder,
    }) => {
      // Arrange
      const longContent = 'x'.repeat(1000);
      const newPost: CreatePostPayload = {
        userId: 1,
        title: 'Long Title '.repeat(10),
        body: longContent,
      };

      // Act
      const response = await jsonPlaceholder.createPost(newPost);

      // Assert
      expect(response.status).toBe(201);
      expect(response.body.body.length).toBe(longContent.length);
    });
  });

  test.describe('PUT /posts/:id - Update post (full)', () => {
    test('should update entire post', async ({ jsonPlaceholder }) => {
      // Arrange
      const postId = 1;
      const updatedPost = {
        userId: 1,
        id: postId,
        title: 'Updated Title',
        body: 'Updated body content',
      };

      // Act
      const response = await jsonPlaceholder.updatePostFull(postId, updatedPost);

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toEqual(updatedPost);
    });
  });

  test.describe('PATCH /posts/:id - Update post (partial)', () => {
    test('should partially update post title', async ({ jsonPlaceholder }) => {
      // Arrange
      const postId = 1;
      const updatePayload: UpdatePostPayload = {
        title: 'Patched Title',
      };

      // Act
      const response = await jsonPlaceholder.updatePostPartial(
        postId,
        updatePayload
      );

      // Assert
      expect(response.status).toBe(200);
      expect(response.body.title).toBe(updatePayload.title);
      expect(response.body.id).toBe(postId);
    });

    test('should partially update post body', async ({ jsonPlaceholder }) => {
      // Arrange
      const postId = 2;
      const updatePayload: UpdatePostPayload = {
        body: 'New patched body',
      };

      // Act
      const response = await jsonPlaceholder.updatePostPartial(
        postId,
        updatePayload
      );

      // Assert
      expect(response.status).toBe(200);
      expect(response.body.body).toBe(updatePayload.body);
    });
  });

  test.describe('DELETE /posts/:id - Delete post', () => {
    test('should delete post successfully', async ({ jsonPlaceholder }) => {
      // Arrange
      const postId = 1;

      // Act
      const response = await jsonPlaceholder.deletePost(postId);

      // Assert
      expect(response.status).toBe(200);
      expect(response.ok).toBe(true);
    });

    test('should return empty object on successful delete', async ({
      jsonPlaceholder,
    }) => {
      // Act
      const response = await jsonPlaceholder.deletePost(5);

      // Assert
      expect(response.status).toBe(200);
      expect(Object.keys(response.body).length).toBeLessThanOrEqual(0);
    });
  });

  test.describe('Data validation', () => {
    test('should have valid title format', async ({ jsonPlaceholder }) => {
      // Act
      const response = await jsonPlaceholder.getAllPosts();

      // Assert
      response.body.forEach((post: any) => {
        expect(post.title).toBeTruthy();
        expect(post.title.length).toBeGreaterThan(0);
        expect(post.title.length).toBeLessThan(300);
      });
    });

    test('should have unique post IDs', async ({ jsonPlaceholder }) => {
      // Act
      const response = await jsonPlaceholder.getAllPosts();

      // Assert
      const ids = response.body.map((post: any) => post.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });
  });
});
