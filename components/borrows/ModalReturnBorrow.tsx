'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { useEffect, useRef, useState } from 'react'
import { Scanner } from '@/components/common/Scanner'
import { toast } from 'sonner'
import { returnBorrowAction } from '@/lib/actions/return-borrow'
import Link from 'next/link'
import { Button } from '../ui/button'
import { ArrowRight } from 'lucide-react'
import { FormReturnBorrow } from './FormReturnBorrow'
import { usePathname, useRouter } from 'next/navigation'
import { BorrowDetail } from '@/lib/types/borrow'
import { Checkbox } from '../ui/checkbox'
import { Label } from '../ui/label'

export const BtnScanReturnBorrow: React.FC<
  React.PropsWithChildren<Parameters<typeof Button>[0]>
> = ({ children, ...props }) => {
  const [open, setOpen] = useState(false)
  const [id, setId] = useState<string>()
  const [quickScan, setQuickScan] = useState(false)

  const onChange = async (id: string) => {
    const res = await returnBorrowAction({ id })
    if ('error' in res) {
      toast.error(res.error)
    } else {
      toast('Book returned successfully')
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button onClick={() => setOpen(true)} variant="outline" {...props}>
          {children}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Scan to Return</DialogTitle>
        </DialogHeader>
        <Scanner
          title="Return a Book"
          onChange={quickScan ? onChange : setId}
          value=""
          initialFocus
        />

        <DialogFooter className="sm:justify-between">
          <div className="flex items-center gap-2">
            <Checkbox
              id="quick-scan"
              checked={quickScan}
              onCheckedChange={(v) => setQuickScan(!!v)}
            />
            <Label htmlFor="quick-scan">Quick Scan</Label>
          </div>
          {id && (
            <Button variant="ghost" asChild>
              <Link href={`/borrows/${id}`}>
                Go to Borrow Details
                <ArrowRight className="mr-2 size-4" />
              </Link>
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export const ModalReturnBorrow: React.FC<{ borrow: BorrowDetail }> = ({
  borrow,
}) => {
  const router = useRouter()
  const pathname = usePathname()
  const [open, setOpen] = useState(true)
  const prevPathRef = useRef(pathname)

  useEffect(() => {
    if (pathname !== prevPathRef.current) {
      setOpen(false)
    }
    prevPathRef.current = pathname
  }, [pathname])

  return (
    <Dialog open={open} onOpenChange={router.back}>
      <DialogContent className="bg-background/5 backdrop-blur-md">
        <DialogHeader>
          <DialogTitle>{borrow.book.title}</DialogTitle>
          <DialogDescription>{borrow.subscription.user.name}</DialogDescription>
        </DialogHeader>

        <FormReturnBorrow borrow={borrow} />
      </DialogContent>
    </Dialog>
  )
}
