# Pay Lightning Address

### `lightning.payLightningAddress(address: string, amountMsats: number)`

Attempts to pay a Lightning Address by first negotiating a BOLT11 invoice over LNURL-pay.

`amountMsats` must be in milli-satoshis and within the receiver's allowed LNURL range.

```ts twoslash
// @esModuleInterop
import { WalletDirector } from '@fedimint/core'
import { WasmWorkerTransport } from '@fedimint/transport-web'

const director = new WalletDirector(new WasmWorkerTransport())
const wallet = await director.createWallet()

await wallet.open()

const response = await wallet.lightning.payLightningAddress(
  // [!code focus]
  'name@domain.com', // [!code focus]
  10_000, // msats // [!code focus]
) // [!code focus]

if (
  typeof response !== 'object' ||
  !response ||
  !('contract_id' in response) ||
  !('fee' in response) ||
  !('payment_type' in response)
) {
  throw new Error('Unexpected payment response')
}

const payment = response as {
  contract_id: string
  fee: number
  payment_type: { lightning?: string; internal?: string }
}

console.log(payment.contract_id)
console.log(payment.fee)

if (payment.payment_type.lightning) {
  const operationId = payment.payment_type.lightning
  const result = await wallet.lightning.waitForPay(operationId) // [!code focus]
  if (result.success) {
    console.log(result.data.preimage)
  }
}
```
