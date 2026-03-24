import { BaseChart } from './BaseChart'
import type { EChartsOption } from 'echarts'
import type { LineChartData } from '../../types'

interface LineChartProps {
  data: LineChartData
  title?: string
  height?: number | string
  smooth?: boolean
  showArea?: boolean
  loading?: boolean
  className?: string
}

/**
 * LineChart Component
 * 
 * Line chart with Whatfix styling.
 * 
 * @example
 * ```tsx
 * <LineChart
 *   data={{
 *     xAxis: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
 *     series: [
 *       { name: 'Users', data: [120, 200, 150, 280, 300] },
 *       { name: 'Sessions', data: [80, 150, 100, 200, 250] },
 *     ],
 *   }}
 *   title="Monthly trends"
 *   showArea
 * />
 * ```
 */
export function LineChart({
  data,
  title,
  height = 300,
  smooth = true,
  showArea = false,
  loading = false,
  className,
}: LineChartProps) {
  const option: EChartsOption = {
    title: title
      ? {
          text: title,
          left: 0,
        }
      : undefined,
    tooltip: {
      trigger: 'axis',
    },
    legend: {
      data: data.series.map((s) => s.name),
      bottom: 0,
    },
    grid: {
      left: 16,
      right: 16,
      top: title ? 48 : 24,
      bottom: 48,
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: data.xAxis,
      boundaryGap: false,
    },
    yAxis: {
      type: 'value',
    },
    series: data.series.map((s) => ({
      name: s.name,
      type: 'line',
      data: s.data,
      smooth,
      areaStyle: showArea
        ? {
            opacity: 0.1,
          }
        : undefined,
      emphasis: {
        focus: 'series',
      },
    })),
  }

  return (
    <BaseChart
      option={option}
      height={height}
      loading={loading}
      className={className}
    />
  )
}
