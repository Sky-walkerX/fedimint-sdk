import { FedimintWallet, WalletDirector } from '@fedimint/core'
import { WasmWorkerTransport } from '@fedimint/transport-web'

const wallet = new FedimintWallet()
const director = new WalletDirector(new WasmWorkerTransport())

wallet.setLogLevel('debug')
wallet.open()

export { wallet, director }
