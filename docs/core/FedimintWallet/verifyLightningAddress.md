# Verify Lightning Address

### `director.verifyLightningAddress(address: string)`

Verifies a Lightning Address and returns LNURL-pay metadata.

The response typically includes fields like `callback`, `minSendable`, and `maxSendable`.

<!-- prettier-ignore -->
```ts twoslash
// @esModuleInterop
import { WalletDirector } from '@fedimint/core'
import { WasmWorkerTransport } from '@fedimint/transport-web'

const director = new WalletDirector(new WasmWorkerTransport())
const wallet = await director.createWallet()

await wallet.open()

const lnurl = await director.verifyLightningAddress(
  // [!code focus]
  'name@domain.com', // [!code focus]
) // [!code focus]

console.log(lnurl.callback) // callback URL to request invoice
console.log(lnurl.minSendable) // minimum amount in msats
console.log(lnurl.maxSendable) // maximum amount in msats
```
