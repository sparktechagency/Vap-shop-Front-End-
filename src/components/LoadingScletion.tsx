import React from 'react'
import { Skeleton } from './ui/skeleton'

function LoadingScletion() {
    return (
        <div className="container !py-10">
            <div className="mb-8">
                <Skeleton className="h-10 w-full max-w-3xl mx-auto" />
            </div>
            <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-center space-x-4 p-4 border rounded-lg">
                        <Skeleton className="h-12 w-12 rounded-xl" />
                        <div className="space-y-2 flex-1">
                            <Skeleton className="h-4 w-[200px]" />
                            <Skeleton className="h-4 w-[150px]" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default LoadingScletion