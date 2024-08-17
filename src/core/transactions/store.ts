import { atom, computed, onMount, task, type Atom } from 'nanostores'
import type { Transaction } from './models/transaction'
import {
  initDB,
  loadTransactions,
  saveTransactions,
  updateTransactionInDB,
  clearTransactions
} from '@/core/db'

// export const balance = atom<number>(0)
export const transactions = atom<Array<Transaction>>([])
export const loadedByFileTransactions = atom<Array<Transaction>>([])
export const groupedTransactionsEnabled = atom<boolean>(false)

export function resetStore() {
  transactions.set([])
  loadedByFileTransactions.set([])
  groupedTransactionsEnabled.set(false)
}

// load main transactions list from DB
onMount(transactions, () => {
  console.log('Mounted')
  task(async () => {
    const db = await initDB()
    if (db) {
      let t = []
      try {
        t = await loadTransactions()
      } catch (error) {
        console.log('Error loading transactions', error)
      }
      transactions.set(t)
    }
  })

  return () => {
    console.log('Unmounted')
    resetStore()
  }
})

// functions for all kinds of transactions

export const clearAllData = () => {
  task(async () => {
    await clearTransactions()
    resetStore()
  })
}

function groupTransactions(transactions: Transaction[]) {
  const transactionsMap = new Map<string, Transaction>()

  console.log(transactions)
  transactions.forEach(transaction => {
    const {
      transactionName,
      category,
      transactionSum,
      type,
      sumInBalanceCurrency,
      currency,
      description
    } = transaction

    if (transactionsMap.has(transactionName)) {
      const existing = transactionsMap.get(transactionName)!
      existing.transactionSum += transactionSum
    } else {
      transactionsMap.set(transactionName, {
        id: transactionName,
        date: transaction.date,
        transactionName,
        transactionSum,
        sumInBalanceCurrency,
        currency,
        description,
        category,
        type
      })
    }
  })

  return Array.from(transactionsMap.values())
}

const sortTransactions = (transactions: Transaction[]) => {
  return transactions.sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime()
  })
}

function updateTransaction(
  updateDb = true,
  list: Atom<Transaction[]>
): (id: string, newName: string, newCategory: string) => void {
  return function (id: string, newName: string, newCategory: string) {
    const t = list.get()

    const updatedTransactions = t.map(transaction => {
      if (transaction.id === id) {
        const updatedTransaction = {
          ...transaction,
          transactionName: newName,
          category: newCategory
        }

        if (updateDb) {
          // Save the updated transaction to IndexedDB
          updateTransactionInDB(updatedTransaction)
        }

        return updatedTransaction
      }

      return transaction
    })

    transactions.set(updatedTransactions)
  }
}

function updateTransactionsByName(
  updateDb = true,
  list: Atom<Transaction[]>
): (originalName: string, newName: string, newCategory: string) => void {
  return function (originalName: string, newName: string, newCategory: string) {
    const t = list.get()

    const updatedTransactions = t.map(transaction => {
      if (transaction.transactionName === originalName) {
        const updatedTransaction = {
          ...transaction,
          transactionName: newName,
          category: newCategory
        }

        if (updateDb) {
          // Save the updated transaction to IndexedDB
          updateTransactionInDB(updatedTransaction)
        }

        return updatedTransaction
      }

      return transaction
    })

    list.set(updatedTransactions)
  }
}

const updateBalance = (t: readonly Transaction[]) => {
  let lastBalance = 0
  t.forEach(t => {
    lastBalance =
      t.type === 'income'
        ? lastBalance + t.sumInBalanceCurrency
        : lastBalance - t.sumInBalanceCurrency
  })
  console.log(lastBalance)
  return +lastBalance.toFixed(2)
}

export const toggleGroupedTransactions = () =>
  groupedTransactionsEnabled.set(!groupedTransactionsEnabled.get())

// list for history table added by load csv file
export const saveHistory = () =>
  task(async () => {
    const t = loadedByFileTransactions.get()
    await saveTransactions(t)
  })

export const groupedLoadedList = computed(
  loadedByFileTransactions,
  groupTransactions
)

export const sortedLoadedList = computed(
  loadedByFileTransactions,
  sortTransactions
)

export const updateLoadedTransaction = updateTransaction(
  false,
  loadedByFileTransactions
)

export const updateLoadedTransactionsByName = updateTransactionsByName(
  false,
  loadedByFileTransactions
)

loadedByFileTransactions.subscribe(updateBalance)

// full transactions history from DB

export const groupedFullList = computed(transactions, groupTransactions)

export const sortedFullList = computed(transactions, sortTransactions)

export const updateFullListTransaction = updateTransaction(true, transactions)

export const updateFullTransactionsByName = updateTransactionsByName(
  true,
  transactions
)

export const balanceByLoadedData = computed(
  [loadedByFileTransactions],
  updateBalance
)

export const balanceByFullHistory = computed(
  [transactions],
  updateBalance
)
