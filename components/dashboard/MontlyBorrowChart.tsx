'use client'

// import { TrendingUp } from 'lucide-react'
import { CartesianGrid, Line, LineChart, XAxis } from 'recharts'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import { Analysis } from '@/lib/types/analysis'
import { formatDate } from '@/lib/utils'
import { useSearchParams } from 'next/navigation'
import { useMemo } from 'react'
import { format, parse } from 'date-fns'

const chartConfig = {
  total_borrow: {
    label: 'Borrow',
    color: 'var(--chart-1)',
  },
  total_return: {
    label: 'Return',
    color: 'var(--chart-2)',
  },
} satisfies ChartConfig

export function MontlyBorrowChart({ data }: { data: Analysis['borrowing'] }) {
  const params = useSearchParams()
  const paramFrom = params.get('from') as string
  const paramTo = params.get('to') as string

  const [from, to] = useMemo(() => {
    const from = format(
      parse(paramFrom, 'dd-MM-yyyy', new Date()),
      'LLL dd, yyyy'
    )
    const to = format(parse(paramTo, 'dd-MM-yyyy', new Date()), 'LLL dd, yyyy')
    return [from, to]
  }, [paramFrom, paramTo])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Total Borrows</CardTitle>
        <CardDescription>
          {from} - {to}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={data}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="timestamp"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => formatDate(value)}
            />
            <ChartTooltip
              cursor={true}
              content={<ChartTooltipContent />}
              labelFormatter={(value) => formatDate(value)}
            />
            <Line
              dataKey="total_borrow"
              type="natural"
              stroke="var(--color-total_borrow)"
              strokeWidth={1}
              dot={false}
              activeDot={{
                r: 6,
              }}
            />
            <Line
              dataKey="total_return"
              type="natural"
              stroke="var(--color-total_return)"
              strokeWidth={1}
              dot={false}
              activeDot={{
                r: 6,
              }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="leading-none text-muted-foreground">
          Showing total borrows
        </div>
      </CardFooter>
    </Card>
  )
}
