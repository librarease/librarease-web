'use client'

import { Button } from '@/components/ui/button'
import { Heart } from 'lucide-react'
import { useTransition, useState } from 'react'
import { toggleFollowCollectionAction } from '@/lib/actions/collection'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface FollowCollectionButtonProps {
  collectionId: string
  initialIsFollowed: boolean
  className?: string
}

export function FollowCollectionButton({
  collectionId,
  initialIsFollowed,
  className,
}: FollowCollectionButtonProps) {
  const [isPending, startTransition] = useTransition()
  const [isFollowed, setIsFollowed] = useState(initialIsFollowed)

  const handleToggleFollow = () => {
    // Optimistic update
    startTransition(async () => {
      const currentFollowState = isFollowed
      setIsFollowed(!currentFollowState)

      const error = await toggleFollowCollectionAction(
        collectionId,
        currentFollowState
      )

      if (error) {
        setIsFollowed(currentFollowState) // revert on error
        toast.error(error)
      } else {
        toast.success(
          currentFollowState
            ? 'Collection unfollowed'
            : 'Collection followed successfully'
        )
      }
    })
  }

  return (
    <Button
      size="sm"
      className={cn('w-full', className)}
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        handleToggleFollow()
      }}
      disabled={isPending}
    >
      <Heart className={cn('mr-2 size-4', isFollowed && 'fill-current')} />
      {isFollowed ? 'Unfollow' : 'Follow'}
    </Button>
  )
}
