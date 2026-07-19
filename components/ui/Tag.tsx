import { type HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export function Tag({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return <span className={cn('tag', className)} {...props} />
}
