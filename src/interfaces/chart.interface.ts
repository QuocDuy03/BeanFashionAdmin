export interface IBarChartData {
  labels: string[]
  datasets: {
    label: string
    backgroundColor: string
    borderColor: string
    barThickness: number
    borderRadius: number
    data: number[]
  }[]
}

export interface IDoughtnutChartData {
  labels: string[]
  datasets: {
    backgroundColor: string[]
    hoverBackgroundColor: string[]
    data: number[]
  }[]
}
