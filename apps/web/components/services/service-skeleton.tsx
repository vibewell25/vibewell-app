export function ServiceSkeleton() {
  return (
    <div className="group rounded-xl overflow-hidden">
      <div className="relative bg-white/10 backdrop-blur-md border border-white/20 shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-xl overflow-hidden">
        {/* Image skeleton */}
        <div className="aspect-video relative">
          <div className="absolute inset-0 bg-gray-200 animate-pulse"></div>
          
          {/* Category skeleton */}
          <div className="absolute top-3 left-3">
            <div className="h-6 w-20 rounded-full bg-gray-300 animate-pulse"></div>
          </div>
          
          {/* Price skeleton */}
          <div className="absolute bottom-3 right-3">
            <div className="h-8 w-16 rounded-full bg-gray-300 animate-pulse"></div>
          </div>
        </div>
        
        <div className="p-5">
          {/* Title skeleton */}
          <div className="h-6 bg-gray-300 rounded-md animate-pulse"></div>
          
          {/* Tags skeleton */}
          <div className="mt-3 flex flex-wrap gap-2">
            <div className="h-6 w-24 bg-gray-200 rounded-full animate-pulse"></div>
            <div className="h-6 w-20 bg-gray-200 rounded-full animate-pulse"></div>
            <div className="h-6 w-16 bg-gray-200 rounded-full animate-pulse"></div>
          </div>
          
          {/* Description skeleton */}
          <div className="mt-4 space-y-2">
            <div className="h-4 bg-gray-200 rounded-md animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded-md animate-pulse"></div>
          </div>
          
          {/* Button skeleton */}
          <div className="mt-5">
            <div className="h-10 bg-gray-300 rounded-lg animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ServiceSkeletonGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, index) => (
        <ServiceSkeleton key={index} />
      ))}
    </div>
  );
} 