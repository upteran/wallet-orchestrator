import { atom } from 'nanostores'

export const balanceStore = atom<number>(1200)
export const commonTransactionsStore = atom<
  Array<{
    id: string | number
    transactionName: string
    transactionSum: number
    type: 'income' | 'outcome'
    balanceAfterTransaction: number
  }>
>([])
