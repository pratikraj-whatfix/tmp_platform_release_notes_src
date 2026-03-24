import { useEffect, useRef } from 'react'
import ReactEChartsCore from 'echarts-for-react/lib/core'
import * as echarts from 'echarts/core'
import {
  LineChart as ELineChart,
  BarChart as EBarChart,
  PieChart as EPieChart,
} from 'echarts/charts'
import {
  GridComponent,
  TooltipComponent,
  TitleComponent,
  LegendComponent,
} from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import type { EChartsOption } from 'echarts'
import { whatfixTheme, defaultChartOptions } from '../../lib/echarts-theme'
import { cn } from '../../lib/utils'

// Register required ECharts components
echarts.use([
  ELineChart,
  EBarChart,
  EPieChart,
  GridComponent,
  TooltipComponent,
  TitleComponent,
  LegendComponent,
  CanvasRenderer,
])

// Register Whatfix theme
echarts.registerTheme('whatfix', whatfixTheme)

interface BaseChartProps {
  option: EChartsOption
  height?: number | string
  loading?: boolean
  className?: string
  onChartReady?: (instance: unknown) => void
}

/**
 * BaseChart Component
 * 
 * Base wrapper for ECharts with Whatfix theme applied.
 * Use this as a foundation for specific chart types.
 * 
 * @example
 * ```tsx
 * <BaseChart
 *   option={{
 *     xAxis: { data: ['Mon', 'Tue', 'Wed'] },
 *     yAxis: {},
 *     series: [{ type: 'line', data: [10, 20, 30] }]
 *   }}
 *   height={300}
 * />
 * ```
 */
export function BaseChart({
  option,
  height = 300,
  loading = false,
  className,
  onChartReady,
}: BaseChartProps) {
  const chartRef = useRef<ReactEChartsCore>(null)

  useEffect(() => {
    if (chartRef.current && onChartReady) {
      const instance = chartRef.current.getEchartsInstance()
      onChartReady(instance)
    }
  }, [onChartReady])

  const mergedOption: EChartsOption = {
    ...defaultChartOptions,
    ...option,
  }

  return (
    <div className={cn('w-full', className)}>
      <ReactEChartsCore
        ref={chartRef}
        echarts={echarts}
        option={mergedOption}
        theme="whatfix"
        style={{ height }}
        showLoading={loading}
        loadingOption={{
          text: 'Loading...',
          color: '#C74900',
          textColor: '#1F1F32',
          maskColor: 'rgba(255, 255, 255, 0.8)',
        }}
        notMerge={true}
        lazyUpdate={true}
      />
    </div>
  )
}

export { echarts }
