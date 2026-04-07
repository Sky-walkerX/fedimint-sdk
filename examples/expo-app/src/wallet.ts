import WalletDirector from '@fedimint/react-native'
import type { FedimintWallet } from '@fedimint/react-native'
import * as FileSystem from 'expo-file-system'

const dbPath = `${FileSystem.documentDirectory}fedimint_db`

const director = new WalletDirector(dbPath)
let wallet: FedimintWallet | undefined

const walletReady: Promise<FedimintWallet> = director
  .createWallet()
  .then((_wallet) => {
    console.log('Creating wallet...')
    wallet = _wallet
    return _wallet
  })

director.setLogLevel('debug')

export { wallet, director, walletReady }
