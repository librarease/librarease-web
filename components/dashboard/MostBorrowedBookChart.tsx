'use client'

// import { TrendingUp } from 'lucide-react'
import { Bar, BarChart, XAxis, YAxis } from 'recharts'

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
import { useSearchParams } from 'next/navigation'
import { useMemo } from 'react'
import { format, parse } from 'date-fns'

export function MostBorrowedBookChart({ data }: { data: Analysis['book'] }) {
  const chartConfig = data.reduce((acc, { title }, index) => {
    acc[title] = {
      label: title,
      color: `var(--chart-${index + 1})`,
    }
    return acc
  }, {} as ChartConfig)
  const chartData = data.map(({ title, count }) => ({
    browser: title,
    total: count,
    fill: chartConfig[title].color,
  }))

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
        <CardTitle>Most Borrowed Books</CardTitle>
        <CardDescription>
          {from} - {to}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
            margin={{
              left: 0,
            }}
          >
            <YAxis
              dataKey="browser"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) =>
                chartConfig[value as keyof typeof chartConfig].label as string
              }
            />
            <XAxis dataKey="total" type="number" hide />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="total" layout="vertical" radius={5} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        {/* <div className="flex gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="size-4" />
        </div> */}
        <div className="leading-none text-muted-foreground">
          Showing top most borrowed books
        </div>
      </CardFooter>
    </Card>
  )
}
