import type { TransactionItem, TransactionStatus } from '../types/wallet'

type SdkTransaction = {
  timestamp: number
  operationId: string
  kind: 'ln' | 'mint' | 'wallet'
  type: string
  amountMsats?: number
  outcome?: string
}

function toStatus(outcome?: string): TransactionStatus {
  if (!outcome) {
    return 'unknown'
  }

  const normalized = outcome.toLowerCase()

  if (
    normalized.includes('success') ||
    normalized.includes('claimed') ||
    normalized.includes('confirmed') ||
    normalized.includes('funded')
  ) {
    return 'confirmed'
  }

  if (
    normalized.includes('fail') ||
    normalized.includes('error') ||
    normalized.includes('canceled')
  ) {
    return 'failed'
  }

  if (
    normalized.includes('waiting') ||
    normalized.includes('pending') ||
    normalized.includes('created') ||
    normalized.includes('awaiting')
  ) {
    return 'pending'
  }

  return 'unknown'
}

function toDirection(
  kind: SdkTransaction['kind'],
  type: string,
): TransactionItem['direction'] {
  if (kind === 'ln') {
    return type === 'receive' ? 'incoming' : 'outgoing'
  }

  if (kind === 'mint') {
    return type === 'reissue' ? 'incoming' : 'outgoing'
  }

  return type === 'deposit' ? 'incoming' : 'outgoing'
}

function toNote(kind: SdkTransaction['kind'], type: string): string {
  if (kind === 'ln') {
    return type === 'receive' ? 'Lightning receive' : 'Lightning payment'
  }

  if (kind === 'mint') {
    return type === 'reissue' ? 'Ecash reissue' : 'Ecash spend'
  }

  return type === 'deposit' ? 'On-chain deposit' : 'On-chain withdrawal'
}

function formatTimestamp(timestampMs: number): string {
  if (!Number.isFinite(timestampMs) || timestampMs <= 0) {
    return 'unknown time'
  }

  return new Date(timestampMs).toLocaleString()
}

export function mapSdkTransactionsToItems(
  transactions: SdkTransaction[],
): TransactionItem[] {
  return transactions.map((tx) => ({
    id: tx.operationId,
    direction: toDirection(tx.kind, tx.type),
    amountSats: Math.max(0, Math.floor((tx.amountMsats ?? 0) / 1000)),
    note: toNote(tx.kind, tx.type),
    timestamp: formatTimestamp(tx.timestamp),
    status: toStatus(tx.outcome),
  }))
}
