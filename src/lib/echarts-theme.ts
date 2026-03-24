import type { EChartsOption } from 'echarts'

/**
 * Whatfix ECharts Theme
 * Brand-aligned colors and styling for charts
 */
export const whatfixTheme = {
  color: [
    '#0975D7', // Info - primary chart color
    '#21AD73', // Success
    '#C74900', // Primary
    '#E0A400', // Warning
    '#F05663', // Crimson
    '#287ACC', // Bright Blue
    '#F55800', // Orange
    '#7AB0E2', // Bright Blue light
  ],
  backgroundColor: 'transparent',
  textStyle: {
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
    color: '#1F1F32',
  },
  title: {
    textStyle: {
      color: '#1F1F32',
      fontWeight: 700,
      fontSize: 16,
    },
    subtextStyle: {
      color: '#525066',
      fontSize: 12,
    },
  },
  legend: {
    textStyle: {
      color: '#525066',
      fontSize: 12,
    },
    itemWidth: 16,
    itemHeight: 8,
    itemGap: 16,
  },
  tooltip: {
    backgroundColor: '#FFFFFF',
    borderColor: '#ECECF3',
    borderWidth: 1,
    textStyle: {
      color: '#1F1F32',
      fontSize: 12,
    },
    extraCssText: 'box-shadow: 0px 4px 12px 0px rgba(0, 0, 0, 0.12); border-radius: 8px;',
    padding: [12, 16],
  },
  grid: {
    left: 16,
    right: 16,
    top: 48,
    bottom: 24,
    containLabel: true,
  },
  xAxis: {
    axisLine: {
      lineStyle: {
        color: '#DFDDE7',
      },
    },
    axisTick: {
      lineStyle: {
        color: '#DFDDE7',
      },
    },
    axisLabel: {
      color: '#525066',
      fontSize: 12,
    },
    splitLine: {
      lineStyle: {
        color: '#ECECF3',
      },
    },
  },
  yAxis: {
    axisLine: {
      show: false,
    },
    axisTick: {
      show: false,
    },
    axisLabel: {
      color: '#525066',
      fontSize: 12,
    },
    splitLine: {
      lineStyle: {
        color: '#ECECF3',
        type: 'dashed',
      },
    },
  },
  line: {
    smooth: true,
    symbol: 'circle',
    symbolSize: 6,
    lineStyle: {
      width: 2,
    },
  },
  bar: {
    barMaxWidth: 32,
    itemStyle: {
      borderRadius: [4, 4, 0, 0],
    },
  },
  pie: {
    itemStyle: {
      borderColor: '#FFFFFF',
      borderWidth: 2,
    },
    label: {
      color: '#525066',
      fontSize: 12,
    },
  },
}

/**
 * Register the Whatfix theme with ECharts
 */
export function registerWhatfixTheme(echarts: typeof import('echarts')) {
  echarts.registerTheme('whatfix', whatfixTheme)
}

/**
 * Default chart options with common settings
 */
export const defaultChartOptions: Partial<EChartsOption> = {
  animation: true,
  animationDuration: 500,
  animationEasing: 'cubicOut',
}
