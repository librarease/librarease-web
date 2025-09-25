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

type HeatmapData = {
  day_of_week: number
  hour_of_day: number
  minute_of_hour: number
  count: number
}

type HeatmapChartProps = {
  data: HeatmapData[]
  title: string
  countLabel: string
  color?: string
  description?: string
}

export const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export const convertUtcToLocalTime = (
  utcDayOfWeek: number,
  utcHour: number,
  utcMinute: number
) => {
  // Create a UTC date for a reference week (using a fixed date to ensure consistent day mapping)
  // Start with Sunday (day 0) of a reference week
  const referenceDate = new Date('2024-01-07T00:00:00Z') // This is a Sunday in UTC

  // Add the UTC day offset and hour
  const utcDate = new Date(referenceDate)
  utcDate.setUTCDate(referenceDate.getUTCDate() + utcDayOfWeek)
  utcDate.setUTCHours(utcHour, 0, 0, 0)
  utcDate.setUTCMinutes(utcMinute)

  // Convert to local time (browser timezone)
  const localDate = new Date(utcDate.getTime())

  return {
    localDayOfWeek: localDate.getDay(),
    localHour: localDate.getHours(),
    localMinute: localDate.getMinutes(),
  }
}

export const formatTime = (hour: number, minute: number): string => {
  return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
}

const getTimezoneInfo = () => {
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
  const now = new Date()
  const utcOffset = -now.getTimezoneOffset() / 60 // Convert minutes to hours, flip sign
  const offsetString = utcOffset >= 0 ? `+${utcOffset}` : `${utcOffset}`
  return { timezone, offsetString }
}

export const HeatmapChart: React.FC<HeatmapChartProps> = ({
  data,
  title,
  countLabel,
  color = 'var(--chart-1)',
  description,
}) => {
  const { timezone, offsetString } = getTimezoneInfo()

  const chartConfig = {
    count: {
      label: countLabel,
      color: color,
    },
  } satisfies ChartConfig

  const chartData = data.map(
    ({ day_of_week, hour_of_day, minute_of_hour, count }) => {
      const { localDayOfWeek, localHour, localMinute } = convertUtcToLocalTime(
        day_of_week,
        hour_of_day,
        minute_of_hour
      )

      // Create a decimal hour value for positioning (e.g., 14.5 for 14:30)
      const decimalHour = localHour + localMinute / 60

      return {
        x: decimalHour,
        y: localDayOfWeek,
        z: count * 20, // Scale up for bubble size
        count,
        day: dayNames[localDayOfWeek],
        time: formatTime(localHour, localMinute),
        utcDay: dayNames[day_of_week],
        utcTime: formatTime(hour_of_day, minute_of_hour),
        localHour,
        localMinute,
      }
    }
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <p className="text-sm text-muted-foreground">
          {description ||
            `Times shown in your local timezone (${timezone}, UTC${offsetString})`}
        </p>
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
              domain={[0, 23.5]}
              ticks={Array.from({ length: 48 }, (_, i) => i * 0.5)} // Every 30 minutes
              tickFormatter={(value) => {
                const hour = Math.floor(value)
                const minute = (value % 1) * 60
                return formatTime(hour, minute)
              }}
              label={{
                value: 'Time of Day (Local Time)',
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
                        <span className="font-medium">{data.time}</span>
                        <span className="text-muted-foreground">
                          {countLabel}:
                        </span>
                        <span className="font-medium">{data.count}</span>
                        <span className="text-muted-foreground text-xs col-span-2">
                          Local time (UTC: {data.utcDay} {data.utcTime})
                        </span>
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

// Specific implementations for different use cases
export const BorrowHeatmapChart: React.FC<{ data: HeatmapData[] }> = ({
  data,
}) => (
  <HeatmapChart
    data={data}
    title="Borrowing Activity Heatmap"
    countLabel="Borrowings"
    color="var(--chart-1)"
  />
)

export const ReturnHeatmapChart: React.FC<{ data: HeatmapData[] }> = ({
  data,
}) => (
  <HeatmapChart
    data={data}
    title="Return Activity Heatmap"
    countLabel="Returns"
    color="var(--chart-2)"
  />
)
