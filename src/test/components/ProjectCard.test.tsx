import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ProjectCard } from '../../components/ProjectCard';

// Mock motion/react
vi.mock('motion/react', () => ({
  motion: {
    div: ({ children, onClick, className, ...props }: any) => (
      <div onClick={onClick} className={className} {...props}>
        {children}
      </div>
    ),
  },
}));

// Mock lucide-react
vi.mock('lucide-react', () => ({
  ArrowUpRight: () => <svg data-testid="arrow-icon" />,
}));

// Mock ImageWithFallback
vi.mock('../../components/figma/ImageWithFallback', () => ({
  ImageWithFallback: ({ src, alt, className }: any) => (
    <img src={src} alt={alt} className={className} data-testid="project-image" />
  ),
}));

// Mock useTranslation
vi.mock('../../utils/i18n/useTranslation', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'projects.card.categories.web': 'Web Development',
        'projects.card.categories.mobile': 'Mobile App',
        'projects.card.categories.design': 'Design',
        'projects.card.categories.other': 'Other',
      };
      return translations[key] || key;
    },
  }),
}));

describe('ProjectCard', () => {
  const mockProject = {
    id: '123',
    name: 'Test Project',
    description: 'A test project description',
    imageUrl: 'https://example.com/image.jpg',
    category: 'web',
    technologies: ['React', 'TypeScript'],
  };

  it('should render project name', () => {
    render(<ProjectCard project={mockProject} index={0} />);
    expect(screen.getByText('Test Project')).toBeDefined();
  });

  it('should render project description', () => {
    render(<ProjectCard project={mockProject} index={0} />);
    expect(screen.getByText('A test project description')).toBeDefined();
  });

  it('should render project image when imageUrl is provided', () => {
    render(<ProjectCard project={mockProject} index={0} />);
    const image = screen.getByTestId('project-image');
    expect(image).toBeDefined();
    expect(image.getAttribute('src')).toBe('https://example.com/image.jpg');
    expect(image.getAttribute('alt')).toBe('Test Project');
  });

  it('should not render image when imageUrl is not provided', () => {
    const projectWithoutImage = { ...mockProject, imageUrl: undefined };
    render(<ProjectCard project={projectWithoutImage} index={0} />);
    expect(screen.queryByTestId('project-image')).toBeNull();
  });

  it('should render category badge', () => {
    render(<ProjectCard project={mockProject} index={0} />);
    expect(screen.getByText('Web Development')).toBeDefined();
  });

  it('should translate category correctly', () => {
    const mobileProject = { ...mockProject, category: 'mobile' };
    render(<ProjectCard project={mobileProject} index={0} />);
    expect(screen.getByText('Mobile App')).toBeDefined();
  });

  it('should call onProjectClick with project id when clicked', () => {
    const onProjectClick = vi.fn();
    const { container } = render(
      <ProjectCard project={mockProject} index={0} onProjectClick={onProjectClick} />
    );
    
    const card = container.firstChild as HTMLElement;
    fireEvent.click(card);
    
    expect(onProjectClick).toHaveBeenCalledWith('123');
    expect(onProjectClick).toHaveBeenCalledTimes(1);
  });

  it('should not call onProjectClick when callback is not provided', () => {
    const { container } = render(<ProjectCard project={mockProject} index={0} />);
    
    const card = container.firstChild as HTMLElement;
    // Should not throw error
    expect(() => fireEvent.click(card)).not.toThrow();
  });

  it('should not call onProjectClick when project has no id', () => {
    const onProjectClick = vi.fn();
    const projectWithoutId = { ...mockProject, id: undefined };
    const { container } = render(
      <ProjectCard project={projectWithoutId} index={0} onProjectClick={onProjectClick} />
    );
    
    const card = container.firstChild as HTMLElement;
    fireEvent.click(card);
    
    expect(onProjectClick).not.toHaveBeenCalled();
  });

  it('should render with correct cursor style', () => {
    const { container } = render(<ProjectCard project={mockProject} index={0} />);
    const card = container.firstChild as HTMLElement;
    expect(card.className).toContain('cursor-pointer');
  });

  it('should render technologies if provided', () => {
    render(<ProjectCard project={mockProject} index={0} />);
    expect(screen.getByText('React')).toBeDefined();
    expect(screen.getByText('TypeScript')).toBeDefined();
  });

  it('should handle missing category gracefully', () => {
    const projectWithoutCategory = { ...mockProject, category: undefined };
    render(<ProjectCard project={projectWithoutCategory} index={0} />);
    // Should still render without errors
    expect(screen.getByText('Test Project')).toBeDefined();
  });
});
