# Pay Lightning Address

### `lightning.payLightningAddress(address: string, amountMsats: number)`

Attempts to pay a Lightning Address by first negotiating a BOLT11 invoice over LNURL-pay.

`amountMsats` must be in milli-satoshis and within the receiver's allowed LNURL range.

<!-- prettier-ignore -->
```ts twoslash
// @esModuleInterop
import { WalletDirector } from '@fedimint/core'
import { WasmWorkerTransport } from '@fedimint/transport-web'

const director = new WalletDirector(new WasmWorkerTransport())
const wallet = await director.createWallet()

await wallet.open()

const payment = await wallet.lightning.payLightningAddress(
  // [!code focus]
  'name@domain.com', // [!code focus]
  10_000, // msats // [!code focus]
) // [!code focus]

console.log(payment.contract_id)
console.log(payment.fee)

if ('lightning' in payment.payment_type) {
  const operationId = payment.payment_type.lightning
  const result = await wallet.lightning.waitForPay(operationId) // [!code focus]
  if (result.success) {
    console.log(result.data.preimage)
  }
}
```
