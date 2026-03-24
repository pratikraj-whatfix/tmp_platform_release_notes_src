import { BaseChart } from './BaseChart'
import type { EChartsOption } from 'echarts'
import type { BarChartData } from '../../types'

interface BarChartProps {
  data: BarChartData
  title?: string
  height?: number | string
  horizontal?: boolean
  stacked?: boolean
  loading?: boolean
  className?: string
}

/**
 * BarChart Component
 * 
 * Bar chart with Whatfix styling.
 * 
 * @example
 * ```tsx
 * <BarChart
 *   data={{
 *     xAxis: ['Product A', 'Product B', 'Product C'],
 *     series: [
 *       { name: 'Sales', data: [120, 200, 150] },
 *       { name: 'Returns', data: [20, 30, 15] },
 *     ],
 *   }}
 *   title="Product performance"
 *   stacked
 * />
 * ```
 */
export function BarChart({
  data,
  title,
  height = 300,
  horizontal = false,
  stacked = false,
  loading = false,
  className,
}: BarChartProps) {
  const option: EChartsOption = {
    title: title
      ? {
          text: title,
          left: 0,
        }
      : undefined,
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
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
    xAxis: horizontal
      ? {
          type: 'value',
        }
      : {
          type: 'category',
          data: data.xAxis,
        },
    yAxis: horizontal
      ? {
          type: 'category',
          data: data.xAxis,
        }
      : {
          type: 'value',
        },
    series: data.series.map((s) => ({
      name: s.name,
      type: 'bar',
      data: s.data,
      stack: stacked ? 'total' : undefined,
      emphasis: {
        focus: 'series',
      },
      itemStyle: {
        borderRadius: horizontal ? [0, 4, 4, 0] : [4, 4, 0, 0],
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
