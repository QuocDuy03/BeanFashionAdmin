import dayjs from 'dayjs'

export const getBreadCrumLabel = (location: Location): { label: string; value: string }[] => {
  return location.pathname === '/'
    ? [{ label: 'Dashboard', value: '' }]
    : location.pathname
        .split('/')
        .filter(Boolean)
        .map((segment) => ({
          label: segment.charAt(0).toUpperCase() + segment.slice(1),
          value: segment
        }))
}

export const ConvertDateString = (dateString: string): string => {
  const formattedDate = dayjs(dateString).format('DD-MM-YYYY')
  return formattedDate
}
export const ConvertTimeString = (dateString: string): string => {
  const formattedTime = dayjs(dateString).format('HH:mm:ss')
  return formattedTime
}
