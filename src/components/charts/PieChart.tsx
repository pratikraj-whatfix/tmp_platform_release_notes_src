import { BaseChart } from './BaseChart'
import type { EChartsOption } from 'echarts'
import type { PieChartData } from '../../types'

interface PieChartProps {
  data: PieChartData
  title?: string
  height?: number | string
  donut?: boolean
  showLabels?: boolean
  loading?: boolean
  className?: string
}

/**
 * PieChart Component
 * 
 * Pie/donut chart with Whatfix styling.
 * 
 * @example
 * ```tsx
 * <PieChart
 *   data={{
 *     data: [
 *       { name: 'Desktop', value: 1048 },
 *       { name: 'Mobile', value: 735 },
 *       { name: 'Tablet', value: 580 },
 *     ],
 *   }}
 *   title="Device breakdown"
 *   donut
 * />
 * ```
 */
export function PieChart({
  data,
  title,
  height = 300,
  donut = false,
  showLabels = true,
  loading = false,
  className,
}: PieChartProps) {
  const option: EChartsOption = {
    title: title
      ? {
          text: title,
          left: 0,
        }
      : undefined,
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} ({d}%)',
    },
    legend: {
      orient: 'vertical',
      right: 16,
      top: 'center',
    },
    series: [
      {
        type: 'pie',
        radius: donut ? ['40%', '70%'] : '70%',
        center: ['40%', '50%'],
        data: data.data,
        label: {
          show: showLabels,
          formatter: '{b}: {d}%',
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.2)',
          },
        },
      },
    ],
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
