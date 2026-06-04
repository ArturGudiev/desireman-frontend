import { MainPage } from './pages/MainPage'
import { DesireServiceProvider } from './services/DesireServiceContext'

function App() {
  return (
    <DesireServiceProvider>
      <MainPage />
    </DesireServiceProvider>
  )
}

export default App
