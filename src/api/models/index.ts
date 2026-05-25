/**
 * API Response Models
 * Define the structure of API responses for type safety
 */

export interface ApiResponse<T = any> {
  status: number;
  statusText: string;
  headers: Record<string, string>;
  body: T;
  url: string;
  ok: boolean;
}

export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  address?: {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
    geo?: {
      lat: string;
      lng: string;
    };
  };
  phone?: string;
  website?: string;
  company?: {
    name: string;
    catchPhrase: string;
    bs: string;
  };
}

export interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

export interface Comment {
  postId: number;
  id: number;
  name: string;
  email: string;
  body: string;
}

export interface CreatePostPayload {
  userId: number;
  title: string;
  body: string;
}

export interface UpdatePostPayload {
  userId?: number;
  title?: string;
  body?: string;
}

export interface ErrorResponse {
  message: string;
  statusCode: number;
  error?: string;
}
