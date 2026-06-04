import { createContext, useContext, type ReactNode } from 'react'
import { DesireService } from './DesireService'

const DesireServiceContext = createContext<DesireService>(
  DesireService.getInstance(),
)

interface DesireServiceProviderProps {
  children: ReactNode
  service?: DesireService
}

export function DesireServiceProvider({
  children,
  service = DesireService.getInstance(),
}: DesireServiceProviderProps) {
  return (
    <DesireServiceContext.Provider value={service}>
      {children}
    </DesireServiceContext.Provider>
  )
}

export function useDesireService(): DesireService {
  return useContext(DesireServiceContext)
}
