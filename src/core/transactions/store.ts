import { atom, computed, onMount, task, type Atom } from 'nanostores'
import { type Transaction, createTransaction } from './models/transaction'
import {
  initDB,
  loadTransactions,
  saveTransactions,
  updateTransactionInDB,
  clearTransactions
} from '@/core/db'

// helpers
function formatToFixedNumber(value: number) {
  return +value.toFixed(2)
}

// main logic
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
      id,
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
      existing.transactionSum = formatToFixedNumber(
        existing.transactionSum + transactionSum
      )
      existing.sumInBalanceCurrency = formatToFixedNumber(
        existing.sumInBalanceCurrency + sumInBalanceCurrency
      )
    } else {
      transactionsMap.set(transactionName, {
        id,
        date: transaction.date,
        transactionName,
        transactionSum: formatToFixedNumber(transactionSum),
        sumInBalanceCurrency: formatToFixedNumber(sumInBalanceCurrency),
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

const updateBalance = (transactions: readonly Transaction[]) => {
  const { balance, totalIncomes, totalOutcomes } = transactions.reduce(
    (acc, t) => {
      if (t.type === 'income') {
        acc.balance += t.sumInBalanceCurrency
        acc.totalIncomes += t.sumInBalanceCurrency
      } else if (t.type === 'outcome') {
        acc.balance -= t.sumInBalanceCurrency
        acc.totalOutcomes += t.sumInBalanceCurrency
      }
      return acc
    },
    { balance: 0, totalIncomes: 0, totalOutcomes: 0 }
  )

  return {
    balance: formatToFixedNumber(balance),
    totalIncomes: formatToFixedNumber(totalIncomes),
    totalOutcomes: formatToFixedNumber(totalOutcomes)
  }
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

export const loadedList = computed(
  [groupedTransactionsEnabled, groupedLoadedList, sortedLoadedList],
  isEnable => {
    return isEnable ? groupedLoadedList.get() : sortedLoadedList.get()
  }
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

export const loadedFullList = computed(
  [groupedTransactionsEnabled, groupedFullList, sortedFullList],
  isEnable => {
    return isEnable ? groupedFullList.get() : sortedFullList.get()
  }
)

export const updateFullListTransaction = updateTransaction(true, transactions)

export const updateFullTransactionsByName = updateTransactionsByName(
  true,
  transactions
)

export const balanceByLoadedData = computed(
  [loadedByFileTransactions],
  updateBalance
)

export const balanceByFullHistory = computed([transactions], updateBalance)

// manual transactions

export function saveManualTransaction({
  transactionName,
  transactionSum,
  type,
  category
}: {
  transactionName: Transaction['transactionName'],
  transactionSum: Transaction['transactionSum'],
  type: Transaction['type'],
  category: Transaction['category']
}) {
  const newTransaction = createTransaction({
    transactionName,
    transactionSum,
    type,
    sumInBalanceCurrency: transactionSum,
    description: 'string',
    category,
    currency: 'EUR'
  })

  // Update commonTransactionsStore
  transactions.set([...transactions.get(), newTransaction])

  task(async () => {
    // Add transaction to IndexedDB
    await saveTransactions([newTransaction])
  })
}
