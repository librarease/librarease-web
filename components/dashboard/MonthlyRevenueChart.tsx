'use client'

// import { TrendingUp } from 'lucide-react'
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts'

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
import { format, parse } from 'date-fns'
import { useMemo } from 'react'

const chartConfig = {
  subscription: {
    label: 'Subscription',
    color: 'var(--chart-1)',
  },
  fine: {
    label: 'Fine',
    color: 'var(--chart-2)',
  },
} satisfies ChartConfig

export function MonthlyRevenueChart({ data }: { data: Analysis['revenue'] }) {
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
        <CardTitle>Total Revenue</CardTitle>
        <CardDescription>
          {from} - {to}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
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
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <defs>
              <linearGradient id="fillSubscription" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-subscription)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-subscription)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillFine" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-fine)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-fine)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <Area
              dataKey="fine"
              type="natural"
              fill="url(#fillFine)"
              fillOpacity={0.4}
              stroke="var(--color-fine)"
              stackId="a"
            />
            <Area
              dataKey="subscription"
              type="natural"
              fill="url(#fillSubscription)"
              fillOpacity={0.4}
              stroke="var(--color-subscription)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            {/* <div className="flex items-center gap-2 font-medium leading-none">
              Trending up by 5.2% this month <TrendingUp className="size-4" />
            </div> */}
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              Showing total revenue from subscriptions and fines
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}
