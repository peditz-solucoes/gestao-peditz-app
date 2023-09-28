import React, { useEffect } from 'react'
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
      text: 'Título'
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

interface DataCType {
  labels: string[]
  datasets: {
    label: string
    data: number[]
    borderColor: string
    showLine: boolean
    backgroundColor: string
  }[]
}

export const dataC: DataCType = {
  labels: [] as string[],
  datasets: [
    {
      label: 'Dados',
      data: [],
      borderColor: '#2FAA53',
      showLine: false,
      backgroundColor: 'rgb(47, 170, 83, 0.5)'
    }
  ]
}

interface ChartBarProps {
  title: string
  data: {
    label: string
    total: number
  }[]
  dataName: string
}

export const ChartBar: React.FC<ChartBarProps> = ({ title, data, dataName }) => {
  const [dataState, setDataState] = React.useState(dataC)
  const [config, setConfig] = React.useState(options)

  useEffect(() => {
    setDataState((prev) => {
      return {
        ...prev,
        labels: data.map((item) => item.label),
        datasets: [
          {
            ...prev.datasets[0],
            label: dataName,
            data: data.map((item) => item.total)
          }
        ]
      }
    })
    setConfig((prev) => {
      return {
        ...prev,
        plugins: {
          ...prev.plugins,
          title: {
            ...prev.plugins?.title,
            text: title
          }
        }
      }
    })
  }, [data, title, dataName])
  return (
    <Bar
      options={{
        ...config,
        scales: {
          x: {
            grid: {
              display: false
            }
          },
          y: {
            grid: {
              display: false
            }
            // ticks: {
            //   display: false
            // }
          }
        }
      }}
      data={dataState}
    />
  )
}
