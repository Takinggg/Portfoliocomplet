import { Clock } from "lucide-react";

interface ReadingTimeProps {
  text: string;
  wordsPerMinute?: number;
  className?: string;
}

export function ReadingTime({ 
  text, 
  wordsPerMinute = 200,
  className = "" 
}: ReadingTimeProps) {
  // Calculate reading time
  const words = text.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);

  return (
    <div className={`flex items-center gap-2 text-sm text-neutral-400 ${className}`}>
      <Clock className="h-4 w-4" />
      <span>{minutes} min de lecture</span>
    </div>
  );
}

// Helper function to calculate reading time from HTML
export function calculateReadingTime(html: string, wordsPerMinute: number = 200): number {
  // Strip HTML tags and calculate
  const text = html.replace(/<[^>]*>/g, ' ');
  const words = text.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

// Helper function to get reading time text
export function getReadingTimeText(minutes: number): string {
  if (minutes < 1) return "< 1 min de lecture";
  if (minutes === 1) return "1 min de lecture";
  return `${minutes} min de lecture`;
}
