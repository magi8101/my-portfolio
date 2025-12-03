export function BlogPostSkeleton() {
  return (
    <div className="animate-pulse">
      {/* Back button */}
      <div className="h-4 w-24 bg-muted rounded mb-12" />
      
      {/* Tags */}
      <div className="flex gap-2 mb-6">
        <div className="h-6 w-16 bg-muted rounded" />
        <div className="h-6 w-20 bg-muted rounded" />
      </div>
      
      {/* Title */}
      <div className="space-y-3 mb-8">
        <div className="h-12 w-full bg-muted rounded" />
        <div className="h-12 w-3/4 bg-muted rounded" />
      </div>
      
      {/* Meta */}
      <div className="flex gap-6 mb-12">
        <div className="h-4 w-28 bg-muted rounded" />
        <div className="h-4 w-20 bg-muted rounded" />
        <div className="h-4 w-16 bg-muted rounded" />
      </div>
      
      {/* Cover image */}
      <div className="aspect-video w-full bg-muted rounded mb-12" />
      
      {/* Content */}
      <div className="space-y-4">
        <div className="h-4 w-full bg-muted rounded" />
        <div className="h-4 w-full bg-muted rounded" />
        <div className="h-4 w-5/6 bg-muted rounded" />
        <div className="h-4 w-full bg-muted rounded" />
        <div className="h-4 w-4/5 bg-muted rounded" />
        <div className="h-8 w-1/2 bg-muted rounded mt-8" />
        <div className="h-4 w-full bg-muted rounded" />
        <div className="h-4 w-full bg-muted rounded" />
        <div className="h-4 w-3/4 bg-muted rounded" />
      </div>
    </div>
  )
}

export function BlogListSkeleton() {
  return (
    <div className="space-y-0 border-t border-border">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="py-8 border-b border-border animate-pulse">
          <div className="grid md:grid-cols-12 gap-8 items-start">
            <div className="hidden md:block md:col-span-1">
              <div className="h-10 w-10 bg-muted rounded" />
            </div>
            
            <div className="md:col-span-7">
              <div className="h-8 w-full bg-muted rounded mb-3" />
              <div className="h-4 w-full bg-muted rounded" />
              <div className="h-4 w-4/5 bg-muted rounded mt-2" />
            </div>
            
            <div className="md:col-span-4 flex gap-4 md:justify-end">
              <div className="h-4 w-24 bg-muted rounded" />
              <div className="h-4 w-20 bg-muted rounded" />
            </div>
          </div>
          
          <div className="flex gap-2 mt-4 md:ml-[calc(8.333%+2rem)]">
            <div className="h-6 w-16 bg-muted rounded" />
            <div className="h-6 w-20 bg-muted rounded" />
          </div>
        </div>
      ))}
    </div>
  )
}
