import WalletDirector from '@fedimint/react-native'
import type { FedimintWallet } from '@fedimint/react-native'
import * as FileSystem from 'expo-file-system/legacy'

// documentDirectory returns a file:// URI; the Rust FFI layer needs a raw path
const docDir = (FileSystem.documentDirectory ?? '').replace(/^file:\/\//, '')
const dbPath = `${docDir}fedimint_db`

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
