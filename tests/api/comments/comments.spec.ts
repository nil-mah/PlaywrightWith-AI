/**
 * Comments API Test Suite
 * Tests for comment endpoints on JSONPlaceholder API
 */

import { test, expect } from '../fixtures/api.fixture';
import { ApiAssertions } from '@api/utils/assertions';
import { Comment } from '@api/models';

test.describe('💬 Comments API Tests', () => {
  test.describe('GET /comments - List all comments', () => {
    test('should retrieve all comments successfully', async ({
      jsonPlaceholder,
    }) => {
      // Act
      const response = await jsonPlaceholder.getAllComments();

      // Assert
      ApiAssertions.assertSuccessStatus(response.status);
      ApiAssertions.assertArrayNotEmpty(response.body);
      expect(response.body.length).toBe(500);
    });

    test('should return comments with valid schema', async ({
      jsonPlaceholder,
    }) => {
      // Act
      const response = await jsonPlaceholder.getAllComments();

      // Assert
      expect(response.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            postId: expect.any(Number),
            id: expect.any(Number),
            name: expect.any(String),
            email: expect.any(String),
            body: expect.any(String),
          }),
        ])
      );
    });
  });

  test.describe('GET /comments/:id - Get comment by ID', () => {
    test('should retrieve comment by valid ID', async ({ jsonPlaceholder }) => {
      // Arrange
      const commentId = 1;

      // Act
      const response = await jsonPlaceholder.getCommentById(commentId);

      // Assert
      ApiAssertions.assertSuccessStatus(response.status);
      expect(response.body.id).toBe(commentId);
      expect(response.body.postId).toBeTruthy();
      expect(response.body.email).toBeTruthy();
    });

    test('should have valid comment data structure', async ({
      jsonPlaceholder,
    }) => {
      // Act
      const response = await jsonPlaceholder.getCommentById(1);

      // Assert
      expect(response.body).toEqual(
        expect.objectContaining({
          postId: expect.any(Number),
          id: expect.any(Number),
          name: expect.any(String),
          email: expect.any(String),
          body: expect.any(String),
        })
      );
    });

    test('should return 404 for non-existent comment', async ({
      jsonPlaceholder,
    }) => {
      // Act
      const response = await jsonPlaceholder.getCommentById(9999);

      // Assert
      expect(response.status).toBe(404);
    });

    test('should retrieve comments with ID range 1-500', async ({
      jsonPlaceholder,
    }) => {
      // Arrange
      const testIds = [1, 100, 250, 500];

      // Act & Assert
      for (const id of testIds) {
        const response = await jsonPlaceholder.getCommentById(id);
        expect(response.status).toBe(200);
        expect(response.body.id).toBe(id);
      }
    });
  });

  test.describe('GET /comments?postId= - Get comments by post', () => {
    test('should retrieve comments for specific post', async ({
      jsonPlaceholder,
    }) => {
      // Arrange
      const postId = 1;

      // Act
      const response = await jsonPlaceholder.getCommentsByPostId(postId);

      // Assert
      expect(response.status).toBe(200);
      expect(response.body.length).toBe(5); // Each post has 5 comments
      response.body.forEach((comment: any) => {
        expect(comment.postId).toBe(postId);
      });
    });

    test('should return empty array for post with no comments', async ({
      jsonPlaceholder,
    }) => {
      // Act
      const response = await jsonPlaceholder.getCommentsByPostId(9999);

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(0);
    });

    test('should retrieve comments for multiple posts', async ({
      jsonPlaceholder,
    }) => {
      // Arrange & Act
      for (let postId = 1; postId <= 10; postId++) {
        const response = await jsonPlaceholder.getCommentsByPostId(postId);

        // Assert
        expect(response.status).toBe(200);
        expect(response.body).toHaveLength(5);
      }
    });
  });

  test.describe('POST /comments - Create comment', () => {
    test('should create a new comment successfully', async ({
      jsonPlaceholder,
    }) => {
      // Arrange
      const newComment: Comment = {
        postId: 1,
        id: 501,
        name: 'Test Comment Name',
        email: 'test@example.com',
        body: 'This is a test comment body',
      };

      // Act
      const response = await jsonPlaceholder.createComment(newComment);

      // Assert
      expect(response.status).toBe(201);
      expect(response.body).toEqual(expect.objectContaining(newComment));
    });

    test('should assign new ID to created comment', async ({
      jsonPlaceholder,
    }) => {
      // Arrange
      const newComment: Comment = {
        postId: 2,
        id: 501,
        name: 'Another Test Comment',
        email: 'another@example.com',
        body: 'Another test body',
      };

      // Act
      const response = await jsonPlaceholder.createComment(newComment);

      // Assert
      expect(response.status).toBe(201);
      expect(response.body.id).toBeDefined();
    });
  });

  test.describe('PATCH /comments/:id - Update comment', () => {
    test('should update comment name', async ({ jsonPlaceholder }) => {
      // Arrange
      const commentId = 1;
      const updatePayload = {
        name: 'Updated Comment Name',
      };

      // Act
      const response = await jsonPlaceholder.updateComment(
        commentId,
        updatePayload
      );

      // Assert
      expect(response.status).toBe(200);
      expect(response.body.name).toBe(updatePayload.name);
      expect(response.body.id).toBe(commentId);
    });

    test('should update comment body', async ({ jsonPlaceholder }) => {
      // Arrange
      const commentId = 2;
      const updatePayload = {
        body: 'Updated comment body content',
      };

      // Act
      const response = await jsonPlaceholder.updateComment(
        commentId,
        updatePayload
      );

      // Assert
      expect(response.status).toBe(200);
      expect(response.body.body).toBe(updatePayload.body);
    });

    test('should update multiple fields', async ({ jsonPlaceholder }) => {
      // Arrange
      const commentId = 3;
      const updatePayload = {
        name: 'New Name',
        email: 'newemail@example.com',
      };

      // Act
      const response = await jsonPlaceholder.updateComment(
        commentId,
        updatePayload
      );

      // Assert
      expect(response.status).toBe(200);
      expect(response.body.name).toBe(updatePayload.name);
      expect(response.body.email).toBe(updatePayload.email);
    });
  });

  test.describe('DELETE /comments/:id - Delete comment', () => {
    test('should delete comment successfully', async ({ jsonPlaceholder }) => {
      // Arrange
      const commentId = 1;

      // Act
      const response = await jsonPlaceholder.deleteComment(commentId);

      // Assert
      expect(response.status).toBe(200);
      expect(response.ok).toBe(true);
    });

    test('should handle deletion of non-existent comment', async ({
      jsonPlaceholder,
    }) => {
      // Act
      const response = await jsonPlaceholder.deleteComment(9999);

      // Assert
      expect(response.status).toBe(200);
    });
  });

  test.describe('Data validation', () => {
    test('should have valid email format', async ({ jsonPlaceholder }) => {
      // Arrange
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      // Act
      const response = await jsonPlaceholder.getAllComments();

      // Assert
      response.body.slice(0, 50).forEach((comment: any) => {
        expect(comment.email).toMatch(emailRegex);
      });
    });

    test('should have non-empty comment body', async ({ jsonPlaceholder }) => {
      // Act
      const response = await jsonPlaceholder.getAllComments();

      // Assert
      response.body.forEach((comment: any) => {
        expect(comment.body).toBeTruthy();
        expect(comment.body.length).toBeGreaterThan(0);
      });
    });

    test('should have unique comment IDs', async ({ jsonPlaceholder }) => {
      // Act
      const response = await jsonPlaceholder.getAllComments();

      // Assert
      const ids = response.body.map((comment: any) => comment.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    test('should have valid postId references', async ({ jsonPlaceholder }) => {
      // Act
      const response = await jsonPlaceholder.getAllComments();

      // Assert
      response.body.forEach((comment: any) => {
        expect(comment.postId).toBeGreaterThan(0);
        expect(comment.postId).toBeLessThanOrEqual(100);
      });
    });
  });
});
