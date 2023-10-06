import React from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ElementChartOptions,
  PluginChartOptions,
  DatasetChartOptions,
  ScaleChartOptions,
  BarControllerChartOptions,
  CoreChartOptions
} from 'chart.js'
import { Bar } from 'react-chartjs-2'
import { _DeepPartialObject } from 'chart.js/dist/types/utils'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

export const options:
  | _DeepPartialObject<
      CoreChartOptions<'bar'> &
        ElementChartOptions<'bar'> &
        PluginChartOptions<'bar'> &
        DatasetChartOptions<'bar'> &
        ScaleChartOptions &
        BarControllerChartOptions
    >
  | undefined = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const
    },
    title: {
      display: true,
      text: 'Visitas nos últimos 7 dias'
    }
  },
  scales: {
    x: {
      grid: {
        display: false
      }
    }
  }
}

const labels = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab', 'Dom']

export const data = {
  labels,
  datasets: [
    {
      label: 'Visitas',
      data: [100, 239, 123, 234, 123, 342, 123],
      borderColor: '#2FAA53',
      showLine: false,
      backgroundColor: 'rgb(47, 170, 83, 0.5)'
    }
  ]
}

export const ChartBar: React.FC = () => {
  return (
    <Bar
      options={{
        ...options,
        scales: {
          x: {
            grid: {
              display: false
            }
          },
          y: {
            grid: {
              display: false
            },
            ticks: {
              display: false
            }
          }
        }
      }}
      data={data}
    />
  )
}
