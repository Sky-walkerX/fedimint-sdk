export type TransactionDirection = 'incoming' | 'outgoing'

export type TransactionStatus = 'confirmed' | 'pending' | 'failed' | 'unknown'

export type TransactionItem = {
  id: string
  direction: TransactionDirection
  amountSats: number
  note: string
  timestamp: string
  status: TransactionStatus
}
