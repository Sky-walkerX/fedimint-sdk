import WalletDirector from '@fedimint/react-native'
import { Paths } from 'expo-file-system'
import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react'

type FedimintContextValue = {
  director: WalletDirector | null
  isInitializing: boolean
  initError: string | null
  reinitialize: () => Promise<void>
}

export const FedimintContext = createContext<FedimintContextValue | undefined>(
  undefined,
)

function getRustDbPath(): string {
  const dbUriPath = `${Paths.document.uri}fedimint_db`
  return dbUriPath.replace(/^file:\/\//, '')
}

export function FedimintProvider({ children }: PropsWithChildren) {
  const [director, setDirector] = useState<WalletDirector | null>(null)
  const [isInitializing, setIsInitializing] = useState(true)
  const [initError, setInitError] = useState<string | null>(null)

  const initialize = useCallback(async () => {
    setIsInitializing(true)
    setInitError(null)

    try {
      const dbPath = getRustDbPath()
      const nextDirector = new WalletDirector(dbPath)
      setDirector(nextDirector)
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Failed to initialize Fedimint SDK'
      setInitError(message)
      setDirector(null)
    } finally {
      setIsInitializing(false)
    }
  }, [])

  useEffect(() => {
    void initialize()
  }, [initialize])

  const value = useMemo<FedimintContextValue>(
    () => ({
      director,
      isInitializing,
      initError,
      reinitialize: initialize,
    }),
    [director, initialize, initError, isInitializing],
  )

  return (
    <FedimintContext.Provider value={value}>
      {children}
    </FedimintContext.Provider>
  )
}
