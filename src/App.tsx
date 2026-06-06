import { MainPage } from './pages/MainPage'
import { AppServicesProvider } from './services/AppServicesContext'

function App() {
  return (
    <AppServicesProvider>
      <MainPage />
    </AppServicesProvider>
  )
}

export default App
