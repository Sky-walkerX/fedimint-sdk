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
  wallet: Awaited<ReturnType<WalletDirector['createWallet']>> | null
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
  const [wallet, setWallet] = useState<Awaited<
    ReturnType<WalletDirector['createWallet']>
  > | null>(null)
  const [isInitializing, setIsInitializing] = useState(true)
  const [initError, setInitError] = useState<string | null>(null)

  const initialize = useCallback(async () => {
    setIsInitializing(true)
    setInitError(null)

    try {
      const dbPath = getRustDbPath()
      const nextDirector = new WalletDirector(dbPath)

      const nextWallet = await nextDirector.createWallet()
      const inviteCode = process.env['EXPO_PUBLIC_FEDIMINT_INVITE_CODE']?.trim()

      if (inviteCode) {
        const joined = await nextWallet.joinFederation(inviteCode)
        if (!joined) {
          await nextWallet.open()
        }
      } else {
        await nextWallet.open()
      }

      setDirector(nextDirector)
      setWallet(nextWallet)
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Failed to initialize Fedimint SDK'
      setInitError(message)
      setDirector(null)
      setWallet(null)
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
      wallet,
      isInitializing,
      initError,
      reinitialize: initialize,
    }),
    [director, initialize, initError, isInitializing, wallet],
  )

  return (
    <FedimintContext.Provider value={value}>
      {children}
    </FedimintContext.Provider>
  )
}
