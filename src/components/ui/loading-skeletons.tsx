import { Skeleton } from "./skeleton";

// Blog Post Card Skeleton
export function BlogPostCardSkeleton() {
  return (
    <div className="group cursor-pointer">
      <div className="relative overflow-hidden rounded-2xl bg-neutral-900/50 border border-neutral-800">
        {/* Image skeleton */}
        <Skeleton className="w-full h-64" />
        
        <div className="p-8">
          {/* Category badge skeleton */}
          <Skeleton className="h-6 w-24 rounded-full mb-4" />
          
          {/* Title skeleton */}
          <Skeleton className="h-8 w-3/4 mb-3" />
          
          {/* Description skeleton */}
          <div className="space-y-2 mb-6">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>
          
          {/* Meta info skeleton */}
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
      </div>
    </div>
  );
}

// Project Card Skeleton
export function ProjectCardSkeleton() {
  return (
    <div className="group cursor-pointer">
      <div className="relative overflow-hidden rounded-3xl bg-neutral-900/50 border border-neutral-800">
        {/* Image skeleton */}
        <Skeleton className="w-full h-80" />
        
        <div className="p-8">
          {/* Tags skeleton */}
          <div className="flex gap-2 mb-4">
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-6 w-24 rounded-full" />
          </div>
          
          {/* Title skeleton */}
          <Skeleton className="h-7 w-2/3 mb-3" />
          
          {/* Description skeleton */}
          <div className="space-y-2 mb-6">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
          </div>
          
          {/* Button skeleton */}
          <Skeleton className="h-10 w-40 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

// Case Study Card Skeleton
export function CaseStudyCardSkeleton() {
  return (
    <div className="group cursor-pointer">
      <div className="relative overflow-hidden rounded-3xl bg-neutral-900/50 border border-neutral-800">
        {/* Image skeleton */}
        <Skeleton className="w-full h-72" />
        
        <div className="p-8">
          {/* Client name skeleton */}
          <Skeleton className="h-5 w-32 mb-2" />
          
          {/* Title skeleton */}
          <Skeleton className="h-7 w-3/4 mb-4" />
          
          {/* Stats skeleton */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div>
              <Skeleton className="h-8 w-16 mb-1" />
              <Skeleton className="h-3 w-20" />
            </div>
            <div>
              <Skeleton className="h-8 w-16 mb-1" />
              <Skeleton className="h-3 w-20" />
            </div>
            <div>
              <Skeleton className="h-8 w-16 mb-1" />
              <Skeleton className="h-3 w-20" />
            </div>
          </div>
          
          {/* Button skeleton */}
          <Skeleton className="h-10 w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
}

// Testimonial Card Skeleton
export function TestimonialCardSkeleton() {
  return (
    <div className="p-8 rounded-2xl bg-neutral-900/50 border border-neutral-800">
      {/* Stars skeleton */}
      <div className="flex gap-1 mb-4">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-5 w-5" />
        ))}
      </div>
      
      {/* Quote skeleton */}
      <div className="space-y-2 mb-6">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
      
      {/* Author skeleton */}
      <div className="flex items-center gap-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="flex-1">
          <Skeleton className="h-5 w-32 mb-2" />
          <Skeleton className="h-4 w-40" />
        </div>
      </div>
    </div>
  );
}

// Resource Card Skeleton
export function ResourceCardSkeleton() {
  return (
    <div className="p-8 rounded-2xl bg-neutral-900/50 border border-neutral-800">
      {/* Icon skeleton */}
      <Skeleton className="h-12 w-12 rounded-xl mb-6" />
      
      {/* Title skeleton */}
      <Skeleton className="h-6 w-3/4 mb-3" />
      
      {/* Description skeleton */}
      <div className="space-y-2 mb-6">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </div>
      
      {/* Meta info skeleton */}
      <div className="flex items-center gap-4 mb-6">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-16" />
      </div>
      
      {/* Button skeleton */}
      <Skeleton className="h-10 w-full rounded-xl" />
    </div>
  );
}

// FAQ Item Skeleton
export function FAQItemSkeleton() {
  return (
    <div className="border border-neutral-800 rounded-2xl p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-2">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>
        <Skeleton className="h-6 w-6 rounded-full flex-shrink-0" />
      </div>
    </div>
  );
}

// Stats Card Skeleton
export function StatsCardSkeleton() {
  return (
    <div className="p-6 rounded-2xl bg-neutral-900/50 border border-neutral-800">
      <Skeleton className="h-4 w-20 mb-3" />
      <Skeleton className="h-10 w-32 mb-2" />
      <Skeleton className="h-3 w-24" />
    </div>
  );
}

// Table Row Skeleton
export function TableRowSkeleton({ columns = 5 }: { columns?: number }) {
  return (
    <tr className="border-b border-neutral-800">
      {[...Array(columns)].map((_, i) => (
        <td key={i} className="py-4 px-6">
          <Skeleton className="h-5 w-full" />
        </td>
      ))}
    </tr>
  );
}

// Grid Skeleton Helper
export function GridSkeleton({
  count = 6,
  columns = 3,
  Component = ProjectCardSkeleton
}: {
  count?: number;
  columns?: 2 | 3 | 4;
  Component?: React.ComponentType;
}) {
  const gridCols = {
    2: "md:grid-cols-2",
    3: "md:grid-cols-3",
    4: "md:grid-cols-4"
  };

  return (
    <div className={`grid grid-cols-1 ${gridCols[columns]} gap-8`}>
      {[...Array(count)].map((_, i) => (
        <Component key={i} />
      ))}
    </div>
  );
}

// Page Header Skeleton
export function PageHeaderSkeleton() {
  return (
    <div className="text-center mb-20">
      <Skeleton className="h-8 w-48 mx-auto mb-8 rounded-full" />
      <Skeleton className="h-16 w-3/4 mx-auto mb-6" />
      <div className="space-y-2 max-w-3xl mx-auto">
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-5/6 mx-auto" />
      </div>
    </div>
  );
}

// Dashboard Card Skeleton
export function DashboardCardSkeleton() {
  return (
    <div className="rounded-2xl bg-neutral-900/50 border border-neutral-800 p-6">
      <div className="flex items-center justify-between mb-4">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-8 w-8 rounded-lg" />
      </div>
      <Skeleton className="h-10 w-40 mb-2" />
      <Skeleton className="h-4 w-24" />
    </div>
  );
}

// Form Skeleton
export function FormSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-12 w-full rounded-xl" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-12 w-full rounded-xl" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-5 w-28" />
        <Skeleton className="h-32 w-full rounded-xl" />
      </div>
      <Skeleton className="h-12 w-full rounded-xl" />
    </div>
  );
}
