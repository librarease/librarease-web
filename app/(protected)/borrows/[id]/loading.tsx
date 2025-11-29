import { Skeleton } from '@/components/ui/skeleton'

export default function Loading() {
  return (
    <div className="mt-4 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="place-self-center md:col-span-2 md:place-self-end">
          <div className="space-x-2">
            <Skeleton className="inline-block w-20 h-8" />
            <Skeleton className="inline-block w-20 h-8" />
          </div>
        </div>
        <Skeleton className="w-full h-96 md:row-span-2" />
        <Skeleton className="w-full h-38 md:h-full" />
        <Skeleton className="w-full h-36 md:h-full" />
        <Skeleton className="w-full h-48 md:col-span-2" />
      </div>
    </div>
  )
}
