import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import { SEO } from '../../components/SEO';

// Mock useLanguage hook
vi.mock('../../utils/i18n/LanguageContext', () => ({
  useLanguage: () => ({
    language: 'en',
    setLanguage: vi.fn(),
  }),
}));

// Mock urlHelpers
vi.mock('../../utils/routing/urlHelpers', () => ({
  generateHrefLangLinks: () => [
    { lang: 'en', url: 'https://example.com/en' },
    { lang: 'fr', url: 'https://example.com/fr' },
  ],
}));

describe('SEO Component', () => {
  beforeEach(() => {
    // Clear document head before each test
    const metaTags = document.head.querySelectorAll('meta');
    metaTags.forEach(tag => {
      if (tag.getAttribute('name') || tag.getAttribute('property')) {
        tag.remove();
      }
    });

    const linkTags = document.head.querySelectorAll('link');
    linkTags.forEach(tag => {
      if (tag.getAttribute('rel') === 'canonical' || 
          tag.getAttribute('rel') === 'alternate') {
        tag.remove();
      }
    });
  });

  afterEach(() => {
    cleanup();
  });

  describe('Title', () => {
    it('should set default title', () => {
      render(<SEO />);
      expect(document.title).toBe('Portfolio Freelance & CRM - Solutions Web sur mesure');
    });

    it('should set custom title', () => {
      render(<SEO title="Custom Page Title" />);
      expect(document.title).toBe('Custom Page Title');
    });

    it('should update title when prop changes', () => {
      const { rerender } = render(<SEO title="First Title" />);
      expect(document.title).toBe('First Title');

      rerender(<SEO title="Second Title" />);
      expect(document.title).toBe('Second Title');
    });
  });

  describe('Meta Description', () => {
    it('should set default description', () => {
      render(<SEO />);
      const metaDescription = document.querySelector('meta[name="description"]');
      expect(metaDescription?.getAttribute('content')).toContain('Création de sites web');
    });

    it('should set custom description', () => {
      render(<SEO description="Custom description for my page" />);
      const metaDescription = document.querySelector('meta[name="description"]');
      expect(metaDescription?.getAttribute('content')).toBe('Custom description for my page');
    });
  });

  describe('Keywords', () => {
    it('should set default keywords', () => {
      render(<SEO />);
      const metaKeywords = document.querySelector('meta[name="keywords"]');
      expect(metaKeywords?.getAttribute('content')).toContain('freelance');
      expect(metaKeywords?.getAttribute('content')).toContain('web development');
    });

    it('should set custom keywords', () => {
      render(<SEO keywords={['react', 'typescript', 'testing']} />);
      const metaKeywords = document.querySelector('meta[name="keywords"]');
      const content = metaKeywords?.getAttribute('content');
      expect(content).toContain('react');
      expect(content).toContain('typescript');
      expect(content).toContain('testing');
    });
  });

  describe('Open Graph Tags', () => {
    it('should set og:title', () => {
      render(<SEO ogTitle="OG Title" />);
      const ogTitle = document.querySelector('meta[property="og:title"]');
      expect(ogTitle?.getAttribute('content')).toBe('OG Title');
    });

    it('should fallback to title for og:title', () => {
      render(<SEO title="Page Title" />);
      const ogTitle = document.querySelector('meta[property="og:title"]');
      expect(ogTitle?.getAttribute('content')).toBe('Page Title');
    });

    it('should set og:description', () => {
      render(<SEO ogDescription="OG Description" />);
      const ogDescription = document.querySelector('meta[property="og:description"]');
      expect(ogDescription?.getAttribute('content')).toBe('OG Description');
    });

    it('should fallback to description for og:description', () => {
      render(<SEO description="Page Description" />);
      const ogDescription = document.querySelector('meta[property="og:description"]');
      expect(ogDescription?.getAttribute('content')).toBe('Page Description');
    });

    it('should set og:image', () => {
      render(<SEO ogImage="/custom-image.jpg" />);
      const ogImage = document.querySelector('meta[property="og:image"]');
      expect(ogImage?.getAttribute('content')).toContain('/custom-image.jpg');
    });

    it('should set og:type', () => {
      render(<SEO ogType="article" />);
      const ogType = document.querySelector('meta[property="og:type"]');
      expect(ogType?.getAttribute('content')).toBe('article');
    });

    it('should default og:type to website', () => {
      render(<SEO />);
      const ogType = document.querySelector('meta[property="og:type"]');
      expect(ogType?.getAttribute('content')).toBe('website');
    });
  });

  describe('Twitter Card', () => {
    it('should set twitter:card', () => {
      render(<SEO />);
      const twitterCard = document.querySelector('meta[name="twitter:card"]');
      expect(twitterCard?.getAttribute('content')).toBe('summary_large_image');
    });

    it('should set twitter:title', () => {
      render(<SEO title="Twitter Title" />);
      const twitterTitle = document.querySelector('meta[name="twitter:title"]');
      expect(twitterTitle?.getAttribute('content')).toBe('Twitter Title');
    });

    it('should set twitter:description', () => {
      render(<SEO description="Twitter Description" />);
      const twitterDescription = document.querySelector('meta[name="twitter:description"]');
      expect(twitterDescription?.getAttribute('content')).toBe('Twitter Description');
    });

    it('should set twitter:image', () => {
      render(<SEO ogImage="/twitter-image.jpg" />);
      const twitterImage = document.querySelector('meta[name="twitter:image"]');
      expect(twitterImage?.getAttribute('content')).toContain('/twitter-image.jpg');
    });
  });

  describe('Canonical URL', () => {
    it('should set canonical link when provided', () => {
      render(<SEO canonical="https://example.com/page" />);
      const canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
      expect(canonical?.href).toBe('https://example.com/page');
    });

    it('should not set canonical when not provided', () => {
      render(<SEO />);
      const canonical = document.querySelector('link[rel="canonical"]');
      expect(canonical).toBeNull();
    });
  });

  describe('Author', () => {
    it('should set default author', () => {
      render(<SEO />);
      const author = document.querySelector('meta[name="author"]');
      expect(author?.getAttribute('content')).toBe('Freelance Portfolio');
    });

    it('should set custom author', () => {
      render(<SEO author="John Doe" />);
      const author = document.querySelector('meta[name="author"]');
      expect(author?.getAttribute('content')).toBe('John Doe');
    });
  });

  describe('Article Times', () => {
    it('should set published time for articles', () => {
      render(<SEO ogType="article" publishedTime="2024-01-01T00:00:00Z" />);
      const publishedTime = document.querySelector('meta[property="article:published_time"]');
      expect(publishedTime?.getAttribute('content')).toBe('2024-01-01T00:00:00Z');
    });

    it('should set modified time for articles', () => {
      render(<SEO ogType="article" modifiedTime="2024-01-02T00:00:00Z" />);
      const modifiedTime = document.querySelector('meta[property="article:modified_time"]');
      expect(modifiedTime?.getAttribute('content')).toBe('2024-01-02T00:00:00Z');
    });

    it('should not set article times when not an article', () => {
      render(<SEO ogType="website" publishedTime="2024-01-01T00:00:00Z" />);
      const publishedTime = document.querySelector('meta[property="article:published_time"]');
      expect(publishedTime).toBeNull();
    });
  });

  describe('Robots', () => {
    it('should allow indexing by default', () => {
      render(<SEO />);
      const robots = document.querySelector('meta[name="robots"]');
      expect(robots?.getAttribute('content')).toBe('index, follow');
    });

    it('should prevent indexing when noindex is true', () => {
      render(<SEO noindex={true} />);
      const robots = document.querySelector('meta[name="robots"]');
      expect(robots?.getAttribute('content')).toBe('noindex, nofollow');
    });
  });

  describe('Multiple Updates', () => {
    it('should update meta tags on rerender', () => {
      const { rerender } = render(<SEO title="First" description="First description" />);
      
      let description = document.querySelector('meta[name="description"]');
      expect(description?.getAttribute('content')).toBe('First description');

      rerender(<SEO title="Second" description="Second description" />);
      
      description = document.querySelector('meta[name="description"]');
      expect(description?.getAttribute('content')).toBe('Second description');
    });

    it('should not duplicate meta tags', () => {
      const { rerender } = render(<SEO title="First" />);
      rerender(<SEO title="Second" />);
      
      const descriptionTags = document.querySelectorAll('meta[name="description"]');
      expect(descriptionTags.length).toBe(1);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty keywords array', () => {
      render(<SEO keywords={[]} />);
      const keywords = document.querySelector('meta[name="keywords"]');
      expect(keywords?.getAttribute('content')).toBe('');
    });

    it('should handle missing optional props', () => {
      expect(() => render(<SEO />)).not.toThrow();
    });

    it('should handle all props provided', () => {
      expect(() => render(
        <SEO 
          title="Full Props"
          description="Full description"
          ogTitle="OG Title"
          ogDescription="OG Desc"
          ogImage="/image.jpg"
          ogType="article"
          canonical="https://example.com"
          keywords={['test']}
          author="Test Author"
          publishedTime="2024-01-01"
          modifiedTime="2024-01-02"
          noindex={false}
        />
      )).not.toThrow();
    });
  });
});
