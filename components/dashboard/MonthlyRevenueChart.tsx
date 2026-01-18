'use client'

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

export function MonthlyRevenueChart({
  data,
  from,
  to,
}: {
  data: Analysis['revenue']
  from: string
  to: string
}) {
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
            <ChartTooltip
              cursor={true}
              content={<ChartTooltipContent />}
              labelFormatter={(value) => formatDate(value)}
            />
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
            />
            <Area
              dataKey="subscription"
              type="natural"
              fill="url(#fillSubscription)"
              fillOpacity={0.4}
              stroke="var(--color-subscription)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              Showing total revenue from subscriptions and fines
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}
