declare module '@fedimint/react-native' {
  type ParsedBolt11Invoice = {
    amount?: number
    expiry?: number
    memo?: string
  }

  type OutgoingLightningPayment = {
    contract_id: string
    fee: number
  }

  type CreateBolt11Response = {
    operation_id: string
    invoice: string
  }

  type WalletTransactionLike = {
    timestamp: number
    operationId: string
    kind: 'ln' | 'mint' | 'wallet'
    type: string
    amountMsats?: number
    outcome?: string
    invoice?: string
  }

  interface FedimintWalletLike {
    open(clientName?: string): Promise<boolean>
    joinFederation(inviteCode: string, clientName?: string): Promise<boolean>
    balance: {
      getBalance(): Promise<number>
    }
    lightning: {
      createInvoice(
        amountMsats: number,
        description: string,
        expiryTime?: number,
      ): Promise<CreateBolt11Response>
      payInvoice(invoice: string): Promise<OutgoingLightningPayment>
    }
    federation: {
      listTransactions(limit?: number): Promise<WalletTransactionLike[]>
    }
  }

  class WalletDirector {
    constructor(dbPath: string, lazy?: boolean)
    createWallet(): Promise<FedimintWalletLike>
    parseBolt11Invoice(invoice: string): Promise<ParsedBolt11Invoice>
  }

  export default WalletDirector
}
