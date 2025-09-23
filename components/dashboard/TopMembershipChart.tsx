'use client'

// import { TrendingUp } from 'lucide-react'
import { Pie, PieChart } from 'recharts'

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
import { useRouter, useSearchParams } from 'next/navigation'
import { useMemo } from 'react'
import { format, parse } from 'date-fns'

export function TopMembershipChart({ data }: { data: Analysis['membership'] }) {
  const router = useRouter()

  const chartConfig = data.reduce((acc, { name }, index) => {
    acc[name] = {
      label: name,
      color: `var(--chart-${index + 1})`,
    }
    return acc
  }, {} as ChartConfig)

  const chartData = data.map(({ id, name, count }) => ({
    name: name,
    visitors: count,
    fill: chartConfig[name].color,
    id: id,
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
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>Top Purchased Membership</CardTitle>
        <CardDescription>
          {from} - {to}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px] pb-0 [&_.recharts-pie-label-text]:fill-foreground"
        >
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <Pie
              data={chartData}
              dataKey="visitors"
              label
              nameKey="name"
              cursor="pointer"
              onClick={({ name }) =>
                router.push(`/admin/memberships?name=${name}`)
              }
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="leading-none text-muted-foreground">
          Showing top purchased membership
        </div>
      </CardFooter>
    </Card>
  )
}
