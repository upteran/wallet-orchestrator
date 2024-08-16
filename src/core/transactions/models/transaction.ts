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
  balanceAfterTransaction: number
}
