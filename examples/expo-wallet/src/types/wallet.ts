export type TransactionDirection = 'incoming' | 'outgoing'

export type TransactionItem = {
  id: string
  direction: TransactionDirection
  amountSats: number
  note: string
  timestamp: string
  status: 'confirmed' | 'pending'
}
