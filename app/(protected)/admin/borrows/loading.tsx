import { Skeleton } from '@/components/ui/skeleton'

export default function Loading() {
  return (
    <>
      <h1 className="text-2xl font-semibold">Borrows</h1>
      <div className="space-y-4">
        <div className="flex justify-between">
          <Skeleton className="w-44" />
          <div className="md:flex gap-2">
            <Skeleton className="w-32 h-9" />
            <Skeleton className="hidden md:block w-32 h-9" />
          </div>
        </div>
        <div className="flex flex-col gap-2 md:flex-row justify-between">
          <Skeleton className="w-full h-16 md:w-110 md:h-9" />
          <div className="self-end flex gap-2">
            <Skeleton className="w-24 h-9" />
            <Skeleton className="w-24 h-9" />
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {new Array(3).fill(0).map((_, idx) => (
            <Skeleton key={idx} className="w-full h-84" />
          ))}
        </div>
      </div>
    </>
  )
}
