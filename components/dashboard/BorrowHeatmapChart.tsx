'use client'

import {
  Scatter,
  ScatterChart,
  XAxis,
  YAxis,
  ZAxis,
  CartesianGrid,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
} from '@/components/ui/chart'

const chartConfig = {
  count: {
    label: 'Borrowings',
    color: 'var(--chart-1)',
  },
} satisfies ChartConfig

const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export const BorrowHeatmapChart: React.FC<{
  data: {
    day_of_week: number
    hour_of_day: number
    count: number
  }[]
}> = ({ data }) => {
  const chartData = data.map(({ day_of_week, hour_of_day, count }) => ({
    x: hour_of_day,
    y: day_of_week,
    z: count * 100, // Scale up for bubble size
    count,
    day: dayNames[day_of_week],
    hour: `${hour_of_day}:00`,
  }))

  console.log(data)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Borrowing Activity Heatmap</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <ScatterChart
            width={800}
            height={400}
            data={chartData}
            margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
          >
            <CartesianGrid />
            <XAxis
              type="number"
              dataKey="x"
              domain={[0, 23]}
              tickFormatter={(value) => `${value}:00`}
              label={{
                value: 'Hour of Day',
                position: 'insideBottom',
                offset: -10,
              }}
            />
            <YAxis
              type="number"
              dataKey="y"
              domain={[0, 6]}
              tickFormatter={(value) => dayNames[value]}
              label={{
                value: 'Day of Week',
                angle: -90,
                position: 'insideLeft',
              }}
            />
            <ZAxis type="number" dataKey="z" range={[50, 400]} />
            <ChartTooltip
              cursor={{ strokeDasharray: '3 3' }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload
                  return (
                    <div className="rounded-lg border bg-background p-2 shadow-sm">
                      <div className="grid grid-cols-2 gap-2">
                        <span className="font-medium">{data.day}</span>
                        <span className="font-medium">{data.hour}</span>
                        <span className="text-muted-foreground">
                          Borrowings:
                        </span>
                        <span className="font-medium">{data.count}</span>
                      </div>
                    </div>
                  )
                }
                return null
              }}
            />
            <Scatter dataKey="z" fill="var(--color-count)" />
          </ScatterChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
