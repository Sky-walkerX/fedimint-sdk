import { FedimintWallet, WalletDirector } from '@fedimint/core'
import { WasmWorkerTransport } from '@fedimint/transport-web'

let wallet: FedimintWallet
const director = new WalletDirector(new WasmWorkerTransport())

if (typeof window !== 'undefined') {
  wallet = new FedimintWallet()
  wallet.setLogLevel('debug')
  wallet.open()

  // Expose for testing
  // globalThis.wallet = wallet
}

export { wallet, director }
