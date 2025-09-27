import React from "react";

function SliderSkeletonComponent() {
    return (
        <div className="w-full h-[400px] relative">
            <div className="absolute inset-0 flex space-x-4 px-4">
                {[...Array(2)].map((_, i) => (
                    <div
                        key={i}
                        className="flex-1 bg-gray-200 rounded-xl animate-pulse"
                        style={{ animationDelay: `${i * 0.1}s` }}
                    />
                ))}
            </div>
        </div>
    );
}

export const SliderSkeleton = React.memo(SliderSkeletonComponent);
