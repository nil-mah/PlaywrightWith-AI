/**
 * JSONPlaceholder API Client
 * Client for interacting with JSONPlaceholder dummy API
 * https://jsonplaceholder.typicode.com
 */

import { APIRequestContext } from '@playwright/test';
import { BaseApiClient } from './base-client';
import {
  User,
  Post,
  Comment,
  CreatePostPayload,
  UpdatePostPayload,
  ApiResponse,
} from '../models';

export class JsonPlaceholderClient extends BaseApiClient {
  constructor(request: APIRequestContext) {
    super(request, 'https://jsonplaceholder.typicode.com');
  }

  /**
   * Get all users
   */
  async getAllUsers(): Promise<ApiResponse<User[]>> {
    return this.get<User[]>('/users');
  }

  /**
   * Get user by ID
   */
  async getUserById(userId: number): Promise<ApiResponse<User>> {
    return this.get<User>(`/users/${userId}`);
  }

  /**
   * Get user by username
   */
  async getUserByUsername(username: string): Promise<ApiResponse<User[]>> {
    return this.get<User[]>('/users', { params: { username } });
  }

  /**
   * Get all posts
   */
  async getAllPosts(): Promise<ApiResponse<Post[]>> {
    return this.get<Post[]>('/posts');
  }

  /**
   * Get posts with pagination
   */
  async getPostsWithPagination(
    page: number = 1,
    limit: number = 10
  ): Promise<ApiResponse<Post[]>> {
    const _start = (page - 1) * limit;
    const _limit = limit;
    return this.get<Post[]>('/posts', { params: { _start, _limit } });
  }

  /**
   * Get post by ID
   */
  async getPostById(postId: number): Promise<ApiResponse<Post>> {
    return this.get<Post>(`/posts/${postId}`);
  }

  /**
   * Get posts by user ID
   */
  async getPostsByUserId(userId: number): Promise<ApiResponse<Post[]>> {
    return this.get<Post[]>('/posts', { params: { userId } });
  }

  /**
   * Create a new post
   */
  async createPost(payload: CreatePostPayload): Promise<ApiResponse<Post>> {
    return this.post<Post>('/posts', payload);
  }

  /**
   * Update a post (PUT)
   */
  async updatePostFull(
    postId: number,
    payload: Post
  ): Promise<ApiResponse<Post>> {
    return this.put<Post>(`/posts/${postId}`, payload);
  }

  /**
   * Update a post (PATCH)
   */
  async updatePostPartial(
    postId: number,
    payload: UpdatePostPayload
  ): Promise<ApiResponse<Post>> {
    return this.patch<Post>(`/posts/${postId}`, payload);
  }

  /**
   * Delete a post
   */
  async deletePost(postId: number): Promise<ApiResponse<any>> {
    return this.delete(`/posts/${postId}`);
  }

  /**
   * Get comments for a post
   */
  async getCommentsByPostId(postId: number): Promise<ApiResponse<Comment[]>> {
    return this.get<Comment[]>('/comments', { params: { postId } });
  }

  /**
   * Get comment by ID
   */
  async getCommentById(commentId: number): Promise<ApiResponse<Comment>> {
    return this.get<Comment>(`/comments/${commentId}`);
  }

  /**
   * Get all comments
   */
  async getAllComments(): Promise<ApiResponse<Comment[]>> {
    return this.get<Comment[]>('/comments');
  }

  /**
   * Create a new comment
   */
  async createComment(payload: Comment): Promise<ApiResponse<Comment>> {
    return this.post<Comment>('/comments', payload);
  }

  /**
   * Update a comment
   */
  async updateComment(
    commentId: number,
    payload: Partial<Comment>
  ): Promise<ApiResponse<Comment>> {
    return this.patch<Comment>(`/comments/${commentId}`, payload);
  }

  /**
   * Delete a comment
   */
  async deleteComment(commentId: number): Promise<ApiResponse<any>> {
    return this.delete(`/comments/${commentId}`);
  }
}
