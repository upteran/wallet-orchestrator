export interface Transaction {
  id: string | number
  date: string
  transactionName: string
  transactionSum: number
  type: 'income' | 'outcome'
  balanceAfterTransaction: number
}
