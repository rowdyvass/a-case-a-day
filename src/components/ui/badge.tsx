import { cn } from '@/lib/utils'
import { cva, type VariantProps } from 'class-variance-authority'

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-slate-100 text-slate-700',
        primary: 'bg-amber-100 text-amber-800',
        secondary: 'bg-slate-100 text-slate-600',
        success: 'bg-emerald-50 text-emerald-700',
        warning: 'bg-amber-50 text-amber-700',
        danger: 'bg-red-50 text-red-700',
        // Muted, editorial category variants
        finance: 'bg-slate-100 text-slate-700 border border-slate-200',
        marketing: 'bg-slate-100 text-slate-700 border border-slate-200',
        strategy: 'bg-slate-100 text-slate-700 border border-slate-200',
        operations: 'bg-slate-100 text-slate-700 border border-slate-200',
        leadership: 'bg-slate-100 text-slate-700 border border-slate-200',
        economics: 'bg-slate-100 text-slate-700 border border-slate-200'
      }
    },
    defaultVariants: {
      variant: 'default'
    }
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export function getConceptBadgeVariant(category: string): BadgeProps['variant'] {
  const categoryMap: Record<string, BadgeProps['variant']> = {
    Finance: 'finance',
    Marketing: 'marketing',
    Strategy: 'strategy',
    Operations: 'operations',
    Leadership: 'leadership',
    Economics: 'economics'
  }
  return categoryMap[category] || 'default'
}
