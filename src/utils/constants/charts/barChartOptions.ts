export const BAR_CHART_OPTIONS = {
  maintainAspectRatio: false,
  aspectRatio: 0.8,
  plugins: {
    legend: {
      position: 'bottom',
      labels: {
        usePointStyle: true,
        pointStyle: 'circle',
        color: '#495057',
        font: {
          size: 14,
          weight: 800
        },
        padding: 30
      }
    },
    zoom: {
      pan: {
        enabled: true
      },
      zoom: {
        enabled: true
      }
    }
  },
  scales: {
    x: {
      ticks: {
        color: '#6c757d',
        font: {
          weight: 500
        }
      },
      grid: {
        display: false,
        drawBorder: false
      },
      offset: true
    },
    y: {
      ticks: {
        color: '#6c757d'
      },
      grid: {
        color: '#dfe7ef',
        drawBorder: false
      }
    }
  }
}
