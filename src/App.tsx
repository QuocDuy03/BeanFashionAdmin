import { RouterProvider } from 'react-router-dom'
import { PrimeReactProvider } from 'primereact/api'

import { router } from '@/routes'

function App() {
  const value = {
    ripple: true
  }
  return (
    <PrimeReactProvider value={value}>
      <RouterProvider router={router} />
    </PrimeReactProvider>
  )
}

export default App
