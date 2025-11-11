import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  getLocalPosts,
  saveLocalPosts,
  addLocalPost,
  updateLocalPost,
  deleteLocalPost,
  getLocalPostBySlug,
  incrementLocalPostViews,
  type LocalBlogPost,
} from '../../utils/localBlogStorage';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('localBlogStorage', () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  describe('getLocalPosts', () => {
    it('should return empty array when no posts exist', () => {
      const posts = getLocalPosts();
      expect(posts).toEqual([]);
    });

    it('should return stored posts', () => {
      const mockPosts: LocalBlogPost[] = [
        {
          id: '1',
          slug: 'test-post',
          title: 'Test Post',
          excerpt: 'Test excerpt',
          content: 'Test content',
          coverImage: 'https://example.com/image.jpg',
          category: 'development',
          tags: ['react', 'typescript'],
          publishedAt: '2024-01-01',
          status: 'published',
        },
      ];

      localStorageMock.setItem(
        'local_blog_posts',
        JSON.stringify({ version: 'v1', posts: mockPosts })
      );

      const posts = getLocalPosts();
      expect(posts).toHaveLength(1);
      expect(posts[0].id).toBe('1');
      expect(posts[0].slug).toBe('test-post');
    });

    it('should deduplicate posts with same id', () => {
      const mockPosts: LocalBlogPost[] = [
        {
          id: '1',
          slug: 'test-post',
          title: 'Test Post',
          excerpt: 'Test excerpt',
          content: 'Test content',
          coverImage: 'https://example.com/image.jpg',
          category: 'development',
          tags: ['react'],
          publishedAt: '2024-01-01',
          status: 'published',
        },
        {
          id: '1',
          slug: 'test-post',
          title: 'Test Post Duplicate',
          excerpt: 'Test excerpt',
          content: 'Test content',
          coverImage: 'https://example.com/image.jpg',
          category: 'development',
          tags: ['react'],
          publishedAt: '2024-01-01',
          status: 'published',
        },
      ];

      localStorageMock.setItem(
        'local_blog_posts',
        JSON.stringify({ version: 'v1', posts: mockPosts })
      );

      const posts = getLocalPosts();
      expect(posts).toHaveLength(1);
    });

    it('should handle invalid JSON gracefully', () => {
      localStorageMock.setItem('local_blog_posts', 'invalid json');
      const posts = getLocalPosts();
      expect(posts).toEqual([]);
    });

    it('should clear storage on version mismatch', () => {
      localStorageMock.setItem(
        'local_blog_posts',
        JSON.stringify({ version: 'v0', posts: [] })
      );

      const posts = getLocalPosts();
      expect(posts).toEqual([]);
      expect(localStorageMock.getItem('local_blog_posts')).toBeNull();
    });
  });

  describe('saveLocalPosts', () => {
    it('should save posts to localStorage', () => {
      const mockPosts: LocalBlogPost[] = [
        {
          id: '1',
          slug: 'test-post',
          title: 'Test Post',
          excerpt: 'Test excerpt',
          content: 'Test content',
          coverImage: 'https://example.com/image.jpg',
          category: 'development',
          tags: ['react'],
          publishedAt: '2024-01-01',
          status: 'published',
        },
      ];

      saveLocalPosts(mockPosts);

      const stored = localStorageMock.getItem('local_blog_posts');
      expect(stored).toBeTruthy();
      
      const data = JSON.parse(stored!);
      expect(data.version).toBe('v1');
      expect(data.posts).toHaveLength(1);
    });

    it('should deduplicate before saving', () => {
      const mockPosts: LocalBlogPost[] = [
        {
          id: '1',
          slug: 'test-post',
          title: 'Test Post',
          excerpt: 'Test excerpt',
          content: 'Test content',
          coverImage: 'https://example.com/image.jpg',
          category: 'development',
          tags: ['react'],
          publishedAt: '2024-01-01',
          status: 'published',
        },
        {
          id: '1',
          slug: 'test-post',
          title: 'Test Post Duplicate',
          excerpt: 'Test excerpt',
          content: 'Test content',
          coverImage: 'https://example.com/image.jpg',
          category: 'development',
          tags: ['react'],
          publishedAt: '2024-01-01',
          status: 'published',
        },
      ];

      saveLocalPosts(mockPosts);

      const stored = JSON.parse(localStorageMock.getItem('local_blog_posts')!);
      expect(stored.posts).toHaveLength(1);
    });
  });

  describe('addLocalPost', () => {
    it('should add a new post', () => {
      const newPost = {
        slug: 'new-post',
        title: 'New Post',
        excerpt: 'New excerpt',
        content: 'New content',
        coverImage: 'https://example.com/image.jpg',
        category: 'development',
        tags: ['react'],
        publishedAt: '2024-01-01',
        status: 'published' as const,
      };

      const added = addLocalPost(newPost);

      expect(added.id).toBeTruthy();
      expect(added.slug).toBe('new-post');

      const posts = getLocalPosts();
      expect(posts).toHaveLength(1);
      expect(posts[0].id).toBe(added.id);
    });

    it('should generate unique id for new post', () => {
      const post1 = addLocalPost({
        slug: 'post-1',
        title: 'Post 1',
        excerpt: 'Excerpt 1',
        content: 'Content 1',
        coverImage: 'https://example.com/image.jpg',
        category: 'development',
        tags: [],
        publishedAt: '2024-01-01',
        status: 'published',
      });

      const post2 = addLocalPost({
        slug: 'post-2',
        title: 'Post 2',
        excerpt: 'Excerpt 2',
        content: 'Content 2',
        coverImage: 'https://example.com/image.jpg',
        category: 'development',
        tags: [],
        publishedAt: '2024-01-01',
        status: 'published',
      });

      expect(post1.id).not.toBe(post2.id);
    });
  });

  describe('updateLocalPost', () => {
    it('should update existing post', () => {
      const post = addLocalPost({
        slug: 'test-post',
        title: 'Test Post',
        excerpt: 'Test excerpt',
        content: 'Test content',
        coverImage: 'https://example.com/image.jpg',
        category: 'development',
        tags: ['react'],
        publishedAt: '2024-01-01',
        status: 'published',
      });

      const updated = updateLocalPost(post.id, {
        title: 'Updated Title',
        excerpt: 'Updated excerpt',
      });

      expect(updated).toBe(true);

      const posts = getLocalPosts();
      expect(posts[0].title).toBe('Updated Title');
      expect(posts[0].excerpt).toBe('Updated excerpt');
      expect(posts[0].slug).toBe('test-post'); // Should not change
    });

    it('should return false for non-existent post', () => {
      const updated = updateLocalPost('non-existent-id', { title: 'New Title' });
      expect(updated).toBe(false);
    });
  });

  describe('deleteLocalPost', () => {
    it('should delete existing post', () => {
      const post = addLocalPost({
        slug: 'test-post',
        title: 'Test Post',
        excerpt: 'Test excerpt',
        content: 'Test content',
        coverImage: 'https://example.com/image.jpg',
        category: 'development',
        tags: ['react'],
        publishedAt: '2024-01-01',
        status: 'published',
      });

      const deleted = deleteLocalPost(post.id);
      expect(deleted).toBe(true);

      const posts = getLocalPosts();
      expect(posts).toHaveLength(0);
    });

    it('should return false for non-existent post', () => {
      const deleted = deleteLocalPost('non-existent-id');
      expect(deleted).toBe(false);
    });
  });

  describe('getLocalPostBySlug', () => {
    it('should return post by slug', () => {
      addLocalPost({
        slug: 'test-post',
        title: 'Test Post',
        excerpt: 'Test excerpt',
        content: 'Test content',
        coverImage: 'https://example.com/image.jpg',
        category: 'development',
        tags: ['react'],
        publishedAt: '2024-01-01',
        status: 'published',
      });

      const post = getLocalPostBySlug('test-post');
      expect(post).toBeTruthy();
      expect(post?.slug).toBe('test-post');
    });

    it('should return null for non-existent slug', () => {
      const post = getLocalPostBySlug('non-existent-slug');
      expect(post).toBeNull();
    });
  });

  describe('incrementLocalPostViews', () => {
    it('should increment views counter', () => {
      const post = addLocalPost({
        slug: 'test-post',
        title: 'Test Post',
        excerpt: 'Test excerpt',
        content: 'Test content',
        coverImage: 'https://example.com/image.jpg',
        category: 'development',
        tags: ['react'],
        publishedAt: '2024-01-01',
        status: 'published',
        views: 5,
      });

      incrementLocalPostViews('test-post');

      const updated = getLocalPostBySlug('test-post');
      expect(updated?.views).toBe(6);
    });

    it('should initialize views to 1 if not set', () => {
      addLocalPost({
        slug: 'test-post',
        title: 'Test Post',
        excerpt: 'Test excerpt',
        content: 'Test content',
        coverImage: 'https://example.com/image.jpg',
        category: 'development',
        tags: ['react'],
        publishedAt: '2024-01-01',
        status: 'published',
      });

      incrementLocalPostViews('test-post');

      const updated = getLocalPostBySlug('test-post');
      expect(updated?.views).toBe(1);
    });

    it('should do nothing for non-existent post', () => {
      expect(() => incrementLocalPostViews('non-existent-slug')).not.toThrow();
    });
  });
});
