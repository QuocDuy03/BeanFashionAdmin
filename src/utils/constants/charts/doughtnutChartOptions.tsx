export const DOUGHTNUT_CHART_OPTIONS = {
    responsive: true,
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
      }
    }
  }