import { nanoid } from 'nanoid'

export interface Transaction {
  id: string | number
  date: string
  transactionName: string
  transactionSum: number
  sumInBalanceCurrency: number
  description: string
  category: string
  currency: string
  type: 'income' | 'outcome'
}

export function createTransaction({
  id = nanoid(),
  date = new Date().toISOString(),
  transactionName,
  transactionSum,
  sumInBalanceCurrency,
  category,
  currency,
  description,
  type
}: Transaction | {
  id?: Transaction['id']
  date?: Transaction['date']
  transactionName: Transaction['transactionName']
  transactionSum: Transaction['transactionSum']
  sumInBalanceCurrency: Transaction['sumInBalanceCurrency']
  description: Transaction['description']
  category: Transaction['category']
  currency: Transaction['currency']
  type: Transaction['type']
}) {
  return {
    id,
    date: date,
    transactionName,
    transactionSum,
    sumInBalanceCurrency,
    category,
    currency,
    description,
    type
  }
}
