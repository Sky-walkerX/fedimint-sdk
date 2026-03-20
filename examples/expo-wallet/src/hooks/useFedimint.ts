import { useContext } from 'react'
import { FedimintContext } from '../providers/FedimintProvider'

export function useFedimint() {
  const context = useContext(FedimintContext)

  if (!context) {
    throw new Error('useFedimint must be used within a FedimintProvider')
  }

  return context
}
