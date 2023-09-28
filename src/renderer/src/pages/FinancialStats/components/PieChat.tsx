import React from 'react'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Pie } from 'react-chartjs-2'

ChartJS.register(ArcElement, Tooltip, Legend)

export const data = {
  labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple'],
  responsive: true,
  width: 400,
  datasets: [
    {
      label: 'Valor',
      data: [12, 19, 3, 5, 2],
      backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)'
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)'
      ],
      borderWidth: 1
    }
  ]
}

const colors = [
  {
    color: '#4C0677',
    backgroundColor: '#a981c4'
  },
  {
    color: '#0583F2',
    backgroundColor: '#A7D7F7'
  },
  {
    color: '#2FAA54',
    backgroundColor: '#C6F6D5'
  },
  {
    color: '#DD6B20',
    backgroundColor: '#FEEBC8'
  },
  {
    color: '#F43F5E',
    backgroundColor: '#FECDD3'
  }
]

interface PieChartProps {
  title?: string
  dataF: {
    label: string
    total: number
  }[]
}

export const PieChart: React.FC<PieChartProps> = ({ title, dataF = [] }) => {
  return (
    <Pie
      data={{
        labels: dataF.map((item) => item.label),
        datasets: [
          {
            label: 'Valor',
            data: dataF.map((item) => item.total),
            backgroundColor: dataF.map((_, key) => colors[key]?.color || '#0583F2')
          }
        ]
      }}
      options={{
        plugins: {
          title: {
            display: !!title,
            text: title
          },
          legend: {
            position: 'top' as const
          }
        }
      }}
    />
  )
}
