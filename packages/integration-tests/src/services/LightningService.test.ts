import { expect } from 'vitest'
import { keyPair } from '../test/crypto'
import { walletTest } from '../test/fixtures'

const LNURL_TEST_ADDRESS = import.meta.env.LNURL_TEST_ADDRESS
const LNURL_TEST_AMOUNT_MSATS = Number(import.meta.env.LNURL_TEST_AMOUNT_MSATS)
const lnurlWalletTest = LNURL_TEST_ADDRESS ? walletTest : walletTest.skip

const parseLnurlPayResponse = (response: unknown) => {
  expect(response).toBeDefined()
  expect(response).toMatchObject({
    callback: expect.any(String),
    maxSendable: expect.any(Number),
    metadata: expect.any(String),
    minSendable: expect.any(Number),
    tag: expect.any(String),
  })
  return response as {
    callback: string
    maxSendable: number
    metadata: string
    minSendable: number
    tag: string
  }
}

const parsePayLightningAddressResponse = (response: unknown) => {
  expect(response).toBeDefined()
  expect(response).toMatchObject({
    contract_id: expect.any(String),
    fee: expect.any(Number),
    payment_type: expect.any(Object),
  })
  return response as {
    contract_id: string
    fee: number
    payment_type: {
      lightning?: string
      internal?: string
    }
  }
}

walletTest(
  'verifyLightningAddress should throw on invalid lightning address',
  async ({ wallet, walletDirector }) => {
    expect(wallet).toBeDefined()
    expect(wallet.isOpen()).toBe(true)

    const counterBefore = wallet.testing.getRequestCounter()
    try {
      await walletDirector.verifyLightningAddress('not-a-lightning-address')
      expect.unreachable('Should throw error')
    } catch (error) {
      expect(error).toBeDefined()
    }

    expect(wallet.testing.getRequestCounter()).toBe(counterBefore + 1)
  },
)

walletTest(
  'payLightningAddress should throw on invalid lightning address',
  async ({ wallet }) => {
    expect(wallet).toBeDefined()
    expect(wallet.isOpen()).toBe(true)

    const counterBefore = wallet.testing.getRequestCounter()
    try {
      await wallet.lightning.payLightningAddress(
        'not-a-lightning-address',
        1000,
      )
      expect.unreachable('Should throw error')
    } catch (error) {
      expect(error).toBeDefined()
    }

    expect(wallet.testing.getRequestCounter()).toBe(counterBefore + 1)
  },
)

lnurlWalletTest(
  'verifyLightningAddress should return lnurl metadata for configured address',
  async ({ wallet, walletDirector }) => {
    expect(wallet).toBeDefined()
    expect(wallet.isOpen()).toBe(true)

    const counterBefore = wallet.testing.getRequestCounter()
    const response =
      await walletDirector.verifyLightningAddress(LNURL_TEST_ADDRESS)
    const lnurl = parseLnurlPayResponse(response)
    expect(lnurl.tag).toBe('payRequest')
    expect(lnurl.callback.length).toBeGreaterThan(0)
    expect(lnurl.minSendable).toBeLessThanOrEqual(lnurl.maxSendable)
    expect(wallet.testing.getRequestCounter()).toBe(counterBefore + 1)
  },
)

lnurlWalletTest(
  'payLightningAddress should pay configured lnurl address',
  { timeout: 20_000 },
  async ({ fundedWallet, walletDirector }) => {
    expect(fundedWallet).toBeDefined()
    expect(fundedWallet.isOpen()).toBe(true)

    const verifyResponse =
      await walletDirector.verifyLightningAddress(LNURL_TEST_ADDRESS)
    const lnurl = parseLnurlPayResponse(verifyResponse)
    const amountMsats = Math.min(
      Math.max(LNURL_TEST_AMOUNT_MSATS || 1000, lnurl.minSendable),
      lnurl.maxSendable,
    )

    const initialBalance = await fundedWallet.balance.getBalance()
    const payment = parsePayLightningAddressResponse(
      await fundedWallet.lightning.payLightningAddress(
        LNURL_TEST_ADDRESS,
        amountMsats,
      ),
    )

    if (payment.payment_type.lightning) {
      const waitResult = await fundedWallet.lightning.waitForPay(
        payment.payment_type.lightning,
      )
      expect(waitResult.success).toBe(true)
    }

    const finalBalance = await fundedWallet.balance.getBalance()
    expect(finalBalance).toBeLessThan(initialBalance)
  },
)

lnurlWalletTest(
  'payLightningAddress should throw when amount is below lnurl minimum',
  async ({ wallet, walletDirector }) => {
    expect(wallet).toBeDefined()
    expect(wallet.isOpen()).toBe(true)

    const verifyResponse =
      await walletDirector.verifyLightningAddress(LNURL_TEST_ADDRESS)
    const lnurl = parseLnurlPayResponse(verifyResponse)
    const invalidAmount = lnurl.minSendable - 1
    expect(invalidAmount).toBeGreaterThanOrEqual(0)

    try {
      await wallet.lightning.payLightningAddress(
        LNURL_TEST_ADDRESS,
        invalidAmount,
      )
      expect.unreachable('Should throw error')
    } catch (error) {
      expect(error).toBeDefined()
    }
  },
)

lnurlWalletTest(
  'payLightningAddress should throw when amount is above lnurl maximum',
  async ({ wallet, walletDirector }) => {
    expect(wallet).toBeDefined()
    expect(wallet.isOpen()).toBe(true)

    const verifyResponse =
      await walletDirector.verifyLightningAddress(LNURL_TEST_ADDRESS)
    const lnurl = parseLnurlPayResponse(verifyResponse)
    const invalidAmount = lnurl.maxSendable + 1

    try {
      await wallet.lightning.payLightningAddress(
        LNURL_TEST_ADDRESS,
        invalidAmount,
      )
      expect.unreachable('Should throw error')
    } catch (error) {
      expect(error).toBeDefined()
    }
  },
)

walletTest(
  'createInvoice should create a bolt11 invoice',
  async ({ wallet }) => {
    expect(wallet).toBeDefined()
    expect(wallet.isOpen()).toBe(true)

    const counterBefore = wallet.testing.getRequestCounter()
    const invoice = await wallet.lightning.createInvoice(100, 'test')
    expect(invoice).toBeDefined()
    expect(invoice).toMatchObject({
      invoice: expect.any(String),
      operation_id: expect.any(String),
    })
    // 3 requests were made, one for the invoice, one for refreshing the
    // gateway cache, one for getting the gateway info
    expect(wallet.testing.getRequestCounter()).toBe(counterBefore + 3)

    // Test with expiry time
    await expect(
      wallet.lightning.createInvoice(100, 'test', 1000),
    ).resolves.toBeDefined()
  },
)

walletTest('createInvoice with expiry', async ({ wallet }) => {
  expect(wallet).toBeDefined()
  expect(wallet.isOpen()).toBe(true)

  const invoice = await wallet.lightning.createInvoice(100, 'test', 1000)
  expect(invoice).toBeDefined()
  expect(invoice).toMatchObject({
    invoice: expect.any(String),
    operation_id: expect.any(String),
  })
})

walletTest(
  'listGateways should return a list of gateways',
  async ({ wallet }) => {
    expect(wallet).toBeDefined()
    expect(wallet.isOpen()).toBe(true)

    const counterBefore = wallet.testing.getRequestCounter()
    const gateways = await wallet.lightning.listGateways()
    expect(wallet.testing.getRequestCounter()).toBe(counterBefore + 1)
    expect(gateways).toBeDefined()
    expect(gateways).toMatchObject(expect.any(Array))
  },
)

walletTest(
  'updateGatewayCache should update the gateway cache',
  async ({ wallet }) => {
    expect(wallet).toBeDefined()
    expect(wallet.isOpen()).toBe(true)

    const counterBefore = wallet.testing.getRequestCounter()
    await expect(wallet.lightning.updateGatewayCache()).resolves.toBeDefined()
    expect(wallet.testing.getRequestCounter()).toBe(counterBefore + 1)
  },
)

walletTest('getGateway should return a gateway', async ({ wallet }) => {
  expect(wallet).toBeDefined()
  expect(wallet.isOpen()).toBe(true)

  const counterBefore = wallet.testing.getRequestCounter()
  const gateway = await wallet.lightning.getGateway()
  expect(wallet.testing.getRequestCounter()).toBe(counterBefore + 1)
  expect(gateway).toMatchObject({
    api: expect.any(String),
    fees: expect.any(Object),
    gateway_id: expect.any(String),
    gateway_redeem_key: expect.any(String),
    lightning_alias: expect.any(String),
    mint_channel_id: expect.any(Number),
    node_pub_key: expect.any(String),
    route_hints: expect.any(Array),
  })
})

walletTest(
  'payInvoice should throw on insufficient funds',
  async ({ wallet }) => {
    expect(wallet).toBeDefined()
    expect(wallet.isOpen()).toBe(true)

    const invoice = await wallet.lightning.createInvoice(100, 'test')
    expect(invoice).toBeDefined()
    expect(invoice).toMatchObject({
      invoice: expect.any(String),
      operation_id: expect.any(String),
    })

    const counterBefore = wallet.testing.getRequestCounter()
    // Insufficient funds
    try {
      await wallet.lightning.payInvoice(invoice.invoice)
      expect.unreachable('Should throw error')
    } catch (error) {
      expect(error).toBeDefined()
    }
    // 3 requests were made, one for paying the invoice, one for refreshing the
    // gateway cache, one for getting the gateway info
    expect(wallet.testing.getRequestCounter()).toBe(counterBefore + 3)
  },
)

walletTest(
  'payInvoice should pay a bolt11 invoice',
  { timeout: 20_000 },
  async ({ fundedWallet }) => {
    expect(fundedWallet).toBeDefined()
    expect(fundedWallet.isOpen()).toBe(true)
    const initialBalance = await fundedWallet.balance.getBalance()
    expect(initialBalance).toBeGreaterThan(0)
    const externalInvoice = await fundedWallet.testing.createFaucetInvoice(1)
    const gatewayInfo = await fundedWallet.testing.getFaucetGatewayInfo()
    const payment = await fundedWallet.lightning.payInvoice(
      externalInvoice,
      gatewayInfo,
    )
    expect(payment).toMatchObject({
      contract_id: expect.any(String),
      fee: expect.any(Number),
      payment_type: expect.any(Object),
    })
    const finalBalance = await fundedWallet.balance.getBalance()
    expect(finalBalance).toBeLessThan(initialBalance)
  },
)

walletTest(
  'createInvoiceTweaked should create a bolt11 invoice with a tweaked public key',
  async ({ wallet }) => {
    expect(wallet).toBeDefined()
    expect(wallet.isOpen()).toBe(true)

    // Make an ephemeral key pair
    const { publicKey, secretKey } = keyPair()
    const tweak = 1

    // Create an invoice paying to the tweaked public key
    const invoice = await wallet.lightning.createInvoiceTweaked(
      1000,
      'test tweaked',
      publicKey,
      tweak,
    )
    expect(invoice).toBeDefined()
    expect(invoice).toMatchObject({
      invoice: expect.any(String),
      operation_id: expect.any(String),
    })
  },
)

walletTest(
  'scanReceivesForTweaks should return the operation id',
  async ({ wallet }) => {
    expect(wallet).toBeDefined()
    expect(wallet.isOpen()).toBe(true)

    // Make an ephemeral key pair
    const { publicKey, secretKey } = keyPair()
    const tweak = 1

    const gatewayInfo = await wallet.testing.getFaucetGatewayInfo()

    // Create an invoice paying to the tweaked public key
    const invoice = await wallet.lightning.createInvoiceTweaked(
      1000,
      'test tweaked',
      publicKey,
      tweak,
      undefined,
      gatewayInfo,
    )
    await expect(
      wallet.testing.payFaucetInvoice(invoice.invoice),
    ).resolves.toBeDefined()

    // Scan for the receive
    const operationIds = await wallet.lightning.scanReceivesForTweaks(
      secretKey,
      [tweak],
      {},
    )
    expect(operationIds).toBeDefined()
    expect(operationIds).toHaveLength(1)

    // Subscribe to claiming the receive
    const subscription = await wallet.lightning.subscribeLnClaim(
      operationIds[0],
      (state) => {
        expect(state).toBeDefined()
        expect(
          typeof state === 'string' &&
            ['claimed', 'awaiting_funds'].includes(state),
        ).toBe(true)
      },
    )
    expect(subscription).toBeDefined()
  },
)

walletTest(
  'subscribe_internal_pay should return state',
  async ({ fundedWallet }) => {
    expect(fundedWallet).toBeDefined()
    expect(fundedWallet.isOpen()).toBe(true)
    const initialBalance = await fundedWallet.balance.getBalance()
    expect(initialBalance).toBeGreaterThan(0)
    const externalInvoice = (
      await fundedWallet.lightning.createInvoice(1, 'test invoice')
    ).invoice
    const payment = await fundedWallet.lightning.payInvoice(externalInvoice)
    expect(payment).toMatchObject({
      contract_id: expect.any(String),
      fee: expect.any(Number),
      payment_type: expect.any(Object),
    })
    const finalBalance = await fundedWallet.balance.getBalance()
    expect(finalBalance).toBeLessThan(initialBalance)
    expect(payment.payment_type).toHaveProperty('internal')
    if ('internal' in payment.payment_type) {
      const id = payment.payment_type.internal
      await new Promise<void>((resolve, reject) => {
        const unsubscribe = fundedWallet.lightning.subscribeInternalPayment(
          id,
          (state) => {
            try {
              expect(state).toBeDefined()
              expect(state).toBe('funding')
              unsubscribe()
              resolve()
            } catch (err) {
              reject(err)
            }
          },
        )
      })
    } else {
      const id = payment.payment_type.lightning
      await new Promise<void>((resolve, reject) => {
        const unsubscribe = fundedWallet.lightning.subscribeLnPay(
          id,
          (state) => {
            try {
              expect(state).toBeDefined()
              expect(state).toBe('created')
              unsubscribe()
              resolve()
            } catch (err) {
              reject(err)
            }
          },
        )
      })
    }
  },
)
