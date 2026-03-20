import type { TransactionItem } from '../types/wallet'

export const mockBalanceSats = 1284500

export const mockTransactions: TransactionItem[] = [
  {
    id: 'tx-001',
    direction: 'incoming',
    amountSats: 120000,
    note: 'Lightning receive',
    timestamp: '2026-03-20 08:20',
    status: 'confirmed',
  },
  {
    id: 'tx-002',
    direction: 'outgoing',
    amountSats: 54000,
    note: 'Cafe payment',
    timestamp: '2026-03-19 14:12',
    status: 'confirmed',
  },
  {
    id: 'tx-003',
    direction: 'incoming',
    amountSats: 250000,
    note: 'Federation transfer',
    timestamp: '2026-03-19 10:01',
    status: 'pending',
  },
  {
    id: 'tx-004',
    direction: 'outgoing',
    amountSats: 32000,
    note: 'Streaming micropayments',
    timestamp: '2026-03-18 23:41',
    status: 'confirmed',
  },
]

export const formatSats = (amountSats: number): string => {
  return `${amountSats.toLocaleString()} sats`
}

export const toMockInvoice = (amountSats: number): string => {
  const padded = amountSats.toString().padStart(8, '0')
  return `lnbc${padded}fedimintmockinvoicepayload`
}
