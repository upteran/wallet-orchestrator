import { atom, computed } from 'nanostores'

interface Transaction {
  id: string | number
  transactionName: string
  transactionSum: number
  type: 'income' | 'outcome'
  balanceAfterTransaction: number
}

export const balanceStore = atom<number>(0)
export const commonTransactionsStore = atom<Array<Transaction>>([])
export const groupedTransactionsEnabled = atom<boolean>(false)

export const toggleGroupedTransactions = () =>
  groupedTransactionsEnabled.set(!groupedTransactionsEnabled.get())

const transactionsMap = new Map<string, Transaction>()

export const groupedTransactionsStore = computed(
  commonTransactionsStore,
  transactions => {
    console.log(transactions)
    transactions.forEach(transaction => {
      const { transactionName, transactionSum, type, balanceAfterTransaction } =
        transaction

      if (transactionsMap.has(transactionName)) {
        const existing = transactionsMap.get(transactionName)!
        existing.transactionSum += transactionSum
        existing.balanceAfterTransaction = balanceAfterTransaction // Update balance after the last grouped transaction
      } else {
        transactionsMap.set(transactionName, {
          id: transactionName,
          transactionName,
          transactionSum,
          type,
          balanceAfterTransaction
        })
      }
    })

    return Array.from(transactionsMap.values())
  }
)

export const transactions = atom<Array<Transaction>>()

commonTransactionsStore.subscribe(() => {
  if (groupedTransactionsEnabled.get()) {
    transactions.set(groupedTransactionsStore.get())
  } else {
    transactions.set(commonTransactionsStore.get())
  }
})

groupedTransactionsEnabled.subscribe(v => {
  transactions.set(
    v ? groupedTransactionsStore.get() : commonTransactionsStore.get()
  )
})
