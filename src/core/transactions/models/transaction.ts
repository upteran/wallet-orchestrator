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
  id,
  date,
  transactionName,
  transactionSum,
  sumInBalanceCurrency,
  category,
  currency,
  description,
  type
}: Transaction) {
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
