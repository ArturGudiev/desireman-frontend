import { createContext, useContext, type ReactNode } from 'react'
import { DesireService } from './DesireService'
import { NecessityService } from './NecessityService'

interface AppServices {
  desireService: DesireService
  necessityService: NecessityService
}

const AppServicesContext = createContext<AppServices>({
  desireService: DesireService.getInstance(),
  necessityService: NecessityService.getInstance(),
})

interface AppServicesProviderProps {
  children: ReactNode
  services?: AppServices
}

export function AppServicesProvider({
  children,
  services = {
    desireService: DesireService.getInstance(),
    necessityService: NecessityService.getInstance(),
  },
}: AppServicesProviderProps) {
  return (
    <AppServicesContext.Provider value={services}>{children}</AppServicesContext.Provider>
  )
}

export function useDesireService(): DesireService {
  return useContext(AppServicesContext).desireService
}

export function useNecessityService(): NecessityService {
  return useContext(AppServicesContext).necessityService
}
