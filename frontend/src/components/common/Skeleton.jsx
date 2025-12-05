import React from 'react';

const Skeleton = ({ className = '', variant = 'default' }) => {
  const baseClasses = 'animate-pulse bg-gray-700 rounded';

  if (variant === 'video') {
    return (
      <div className={`space-y-4 ${className}`}>
        {/* Video player skeleton */}
        <div className={`${baseClasses} aspect-video w-full`}></div>

        {/* Video info skeleton */}
        <div className="space-y-3">
          <div className={`${baseClasses} h-8 w-3/4`}></div>
          <div className={`${baseClasses} h-4 w-1/2`}></div>
          <div className={`${baseClasses} h-4 w-1/4`}></div>

          {/* Channel and actions skeleton */}
          <div className="flex items-center justify-between p-4 bg-gray-800 rounded-xl">
            <div className="flex items-center gap-4">
              <div className={`${baseClasses} w-12 h-12 rounded-full`}></div>
              <div className="space-y-2">
                <div className={`${baseClasses} h-5 w-32`}></div>
                <div className={`${baseClasses} h-4 w-24`}></div>
              </div>
              <div className={`${baseClasses} h-10 w-24 rounded-full`}></div>
            </div>
            <div className="flex items-center gap-2 bg-gray-700 rounded-full p-1">
              <div className={`${baseClasses} h-10 w-16 rounded-full`}></div>
              <div className={`${baseClasses} h-10 w-16 rounded-full`}></div>
              <div className={`${baseClasses} h-10 w-10 rounded-full`}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'comment') {
    return (
      <div className={`flex gap-3 ${className}`}>
        <div className={`${baseClasses} w-10 h-10 rounded-full flex-shrink-0`}></div>
        <div className="flex-1 space-y-2">
          <div className={`${baseClasses} h-4 w-32`}></div>
          <div className={`${baseClasses} h-4 w-full`}></div>
          <div className={`${baseClasses} h-4 w-3/4`}></div>
        </div>
      </div>
    );
  }

  if (variant === 'card') {
    return (
      <div className={`space-y-3 ${className}`}>
        <div className={`${baseClasses} aspect-video w-full rounded-lg`}></div>
        <div className="space-y-2">
          <div className={`${baseClasses} h-4 w-full`}></div>
          <div className={`${baseClasses} h-4 w-2/3`}></div>
          <div className={`${baseClasses} h-3 w-1/2`}></div>
        </div>
      </div>
    );
  }

  // Default skeleton
  return <div className={`${baseClasses} ${className}`}></div>;
};

export default Skeleton;
