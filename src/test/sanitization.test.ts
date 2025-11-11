import { describe, it, expect } from 'vitest';
import DOMPurify from 'dompurify';

describe('DOMPurify Sanitization', () => {
  describe('Blog Post Content', () => {
    it('should allow safe HTML tags', () => {
      const safeHTML = '<p>Hello <strong>world</strong></p>';
      const sanitized = DOMPurify.sanitize(safeHTML, {
        ALLOWED_TAGS: ['p', 'strong', 'em', 'a', 'h1', 'h2', 'h3', 'ul', 'ol', 'li', 'code', 'pre', 'blockquote', 'img'],
        ALLOWED_ATTR: ['href', 'src', 'class', 'id', 'alt'],
      });
      
      expect(sanitized).toBe('<p>Hello <strong>world</strong></p>');
    });

    it('should remove script tags', () => {
      const maliciousHTML = '<p>Hello</p><script>alert("XSS")</script>';
      const sanitized = DOMPurify.sanitize(maliciousHTML, {
        ALLOWED_TAGS: ['p', 'strong', 'em', 'a', 'h1', 'h2', 'h3', 'ul', 'ol', 'li', 'code', 'pre', 'blockquote', 'img'],
        ALLOWED_ATTR: ['href', 'src', 'class', 'id', 'alt'],
      });
      
      expect(sanitized).not.toContain('<script>');
      expect(sanitized).not.toContain('alert');
      expect(sanitized).toBe('<p>Hello</p>');
    });

    it('should remove onclick handlers', () => {
      const maliciousHTML = '<p onclick="alert(\'XSS\')">Click me</p>';
      const sanitized = DOMPurify.sanitize(maliciousHTML, {
        ALLOWED_TAGS: ['p', 'strong', 'em', 'a', 'h1', 'h2', 'h3', 'ul', 'ol', 'li', 'code', 'pre', 'blockquote', 'img'],
        ALLOWED_ATTR: ['href', 'src', 'class', 'id', 'alt'],
      });
      
      expect(sanitized).not.toContain('onclick');
      expect(sanitized).toBe('<p>Click me</p>');
    });

    it('should remove javascript: URLs', () => {
      const maliciousHTML = '<a href="javascript:alert(\'XSS\')">Click</a>';
      const sanitized = DOMPurify.sanitize(maliciousHTML, {
        ALLOWED_TAGS: ['p', 'strong', 'em', 'a', 'h1', 'h2', 'h3', 'ul', 'ol', 'li', 'code', 'pre', 'blockquote', 'img'],
        ALLOWED_ATTR: ['href', 'src', 'class', 'id', 'alt'],
      });
      
      expect(sanitized).not.toContain('javascript:');
    });

    it('should allow safe links', () => {
      const safeHTML = '<a href="https://example.com">Link</a>';
      const sanitized = DOMPurify.sanitize(safeHTML, {
        ALLOWED_TAGS: ['p', 'strong', 'em', 'a', 'h1', 'h2', 'h3', 'ul', 'ol', 'li', 'code', 'pre', 'blockquote', 'img'],
        ALLOWED_ATTR: ['href', 'src', 'class', 'id', 'alt'],
      });
      
      expect(sanitized).toContain('href="https://example.com"');
    });

    it('should allow images with safe attributes', () => {
      const safeHTML = '<img src="https://example.com/image.jpg" alt="Description" />';
      const sanitized = DOMPurify.sanitize(safeHTML, {
        ALLOWED_TAGS: ['p', 'strong', 'em', 'a', 'h1', 'h2', 'h3', 'ul', 'ol', 'li', 'code', 'pre', 'blockquote', 'img'],
        ALLOWED_ATTR: ['href', 'src', 'class', 'id', 'alt'],
      });
      
      expect(sanitized).toContain('src="https://example.com/image.jpg"');
      expect(sanitized).toContain('alt="Description"');
    });

    it('should remove onerror attributes from images', () => {
      const maliciousHTML = '<img src="x" onerror="alert(\'XSS\')" />';
      const sanitized = DOMPurify.sanitize(maliciousHTML, {
        ALLOWED_TAGS: ['p', 'strong', 'em', 'a', 'h1', 'h2', 'h3', 'ul', 'ol', 'li', 'code', 'pre', 'blockquote', 'img'],
        ALLOWED_ATTR: ['href', 'src', 'class', 'id', 'alt'],
      });
      
      expect(sanitized).not.toContain('onerror');
      expect(sanitized).not.toContain('alert');
    });
  });

  describe('Email Template Content', () => {
    it('should allow table elements for email layout', () => {
      const emailHTML = '<table><tr><td>Content</td></tr></table>';
      const sanitized = DOMPurify.sanitize(emailHTML, {
        ALLOWED_TAGS: ['html', 'head', 'body', 'table', 'tr', 'td', 'th', 'thead', 'tbody', 'div', 'span', 'p', 'strong', 'em', 'a', 'img', 'h1', 'h2', 'h3'],
        ALLOWED_ATTR: ['style', 'class', 'width', 'height', 'cellpadding', 'cellspacing', 'border', 'align', 'valign', 'href', 'src', 'alt'],
      });
      
      expect(sanitized).toContain('<table>');
      expect(sanitized).toContain('<tr>');
      expect(sanitized).toContain('<td>');
    });

    it('should allow inline styles for email', () => {
      const emailHTML = '<div style="color: red;">Text</div>';
      const sanitized = DOMPurify.sanitize(emailHTML, {
        ALLOWED_TAGS: ['html', 'head', 'body', 'table', 'tr', 'td', 'th', 'thead', 'tbody', 'div', 'span', 'p', 'strong', 'em', 'a', 'img', 'h1', 'h2', 'h3'],
        ALLOWED_ATTR: ['style', 'class', 'width', 'height', 'cellpadding', 'cellspacing', 'border', 'align', 'valign', 'href', 'src', 'alt'],
      });
      
      expect(sanitized).toContain('style=');
      expect(sanitized).toContain('color');
    });

    it('should remove script tags from email templates', () => {
      const maliciousHTML = '<table><tr><td>Content</td></tr></table><script>alert("XSS")</script>';
      const sanitized = DOMPurify.sanitize(maliciousHTML, {
        ALLOWED_TAGS: ['html', 'head', 'body', 'table', 'tr', 'td', 'th', 'thead', 'tbody', 'div', 'span', 'p', 'strong', 'em', 'a', 'img', 'h1', 'h2', 'h3'],
        ALLOWED_ATTR: ['style', 'class', 'width', 'height', 'cellpadding', 'cellspacing', 'border', 'align', 'valign', 'href', 'src', 'alt'],
      });
      
      expect(sanitized).not.toContain('<script>');
      expect(sanitized).not.toContain('alert');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty string', () => {
      const sanitized = DOMPurify.sanitize('');
      expect(sanitized).toBe('');
    });

    it('should handle null', () => {
      const sanitized = DOMPurify.sanitize(null as any);
      expect(sanitized).toBe('');
    });

    it('should handle plain text', () => {
      const plainText = 'Just plain text';
      const sanitized = DOMPurify.sanitize(plainText);
      expect(sanitized).toBe('Just plain text');
    });

    it('should handle nested malicious content', () => {
      const maliciousHTML = '<div><p><span onclick="alert(\'XSS\')">Text</span></p></div>';
      const sanitized = DOMPurify.sanitize(maliciousHTML, {
        ALLOWED_TAGS: ['div', 'p', 'span'],
        ALLOWED_ATTR: ['class'],
      });
      
      expect(sanitized).not.toContain('onclick');
      expect(sanitized).toBe('<div><p><span>Text</span></p></div>');
    });

    it('should handle unicode and special characters', () => {
      const unicodeHTML = '<p>Hello 👋 世界 🌍</p>';
      const sanitized = DOMPurify.sanitize(unicodeHTML, {
        ALLOWED_TAGS: ['p'],
      });
      
      expect(sanitized).toContain('👋');
      expect(sanitized).toContain('世界');
      expect(sanitized).toContain('🌍');
    });
  });
});
