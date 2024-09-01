import {
  atom,
  computed,
  onMount,
  task,
  type Atom,
  type ReadableAtom
} from 'nanostores'
import { type Dayjs } from 'dayjs'
import {
  type Transaction,
  createTransaction,
  type TransactionsUpdatedData
} from './models/transaction'
import type { Category } from '@core/transactions/models/category'
import {
  initDB,
  loadTransactions,
  saveTransactions,
  updateTransactionInDB,
  clearTransactions,
  getAllUpdatedTransactions,
  saveUpdatedTransaction,
  clearUpdatedKeys
} from '@/core/db'
import { formatToFixedNumber } from '@core/helpers/numbers'
import { prepareTransactions } from './dataProcessing'
import { nanoid } from 'nanoid'
import type { TransactionsCategory } from '@core/transactions/category'

// main logic
export const transactions = atom<Array<Transaction>>([])
export const transactionsUpdateKeys = atom<TransactionsUpdatedData | null>(null)
export const loadedByFileTransactions = atom<Array<Transaction>>([])
export const groupedTransactionsEnabled = atom<boolean>(false)
export const sortBySumType = atom<string | null>(null)
export const sortBySumStep = atom<number>(0)
export const activeCategoryFilter = atom<TransactionsCategory | null>(null)
// Filters
export const startDateFilter = atom<Dayjs | null>(null)
export const endDateFilter = atom<Dayjs | null>(null)

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
      let t: Transaction[] | [] = []
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

onMount(loadedByFileTransactions, () => {
  console.log('Mounted loadedByFileTransactions')
  task(async () => {
    const db = await initDB()
    if (db) {
      let k: TransactionsUpdatedData | null = {}
      try {
        k = (await getAllUpdatedTransactions()) || {}
      } catch (error) {
        console.log('Error loading transactions', error)
      }
      transactionsUpdateKeys.set(k)
    }
  })

  return () => {
    console.log('Unmounted')
    resetStore()
  }
})

// functions for all kinds of transactions
const sortKeyMap = {
  sum: {
    0: null,
    1: 'min',
    2: 'max'
  }
}

export const sortTransactionsBySum = () => {
  const c = sortBySumStep.get()
  sortBySumStep.set(c + 1 > 2 ? 0 : c + 1)
}

sortBySumStep.listen(value => {
  // @ts-expect-error fixme
  sortBySumType.set(sortKeyMap.sum[value])
})

export const clearAllData = () => {
  task(async () => {
    await clearTransactions()
    resetStore()
  })
}

export const clearUpdatedTransactionsData = () => {
  task(async () => {
    await clearUpdatedKeys()
    resetStore()
  })
}

function updateTransactionsByName(
  updateDb = true,
  list: Atom<Transaction[]>
): (
  systemKey: string,
  originalName: string,
  newName: string,
  newCategory: string
) => void {
  return function (
    systemKey: string,
    originalName: string,
    newName: string,
    newCategory: string
  ) {
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

    saveUpdatedTransaction(systemKey, {
      transactionName: newName,
      category: newCategory
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

export const loadedList = computed(
  [
    groupedTransactionsEnabled,
    loadedByFileTransactions,
    startDateFilter,
    endDateFilter,
    sortBySumType,
    activeCategoryFilter
  ],
  prepareTransactions
)

export const updateLoadedTransactionsByName = updateTransactionsByName(
  false,
  loadedByFileTransactions
)

loadedByFileTransactions.subscribe(updateBalance)

// full transactions history from DB

export const loadedFullList = computed(
  [
    groupedTransactionsEnabled,
    transactions,
    startDateFilter,
    endDateFilter,
    sortBySumType,
    activeCategoryFilter
  ],
  prepareTransactions
)

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
  transactionName: Transaction['transactionName']
  transactionSum: Transaction['transactionSum']
  type: Transaction['type']
  category: Transaction['category']
}) {
  const newTransaction = createTransaction({
    transactionName,
    transactionSum,
    type,
    sumInBalanceCurrency: transactionSum,
    description: 'string',
    category,
    systemKey: transactionName
  })

  // Update commonTransactionsStore
  transactions.set([...transactions.get(), newTransaction])

  task(async () => {
    // Add transaction to IndexedDB
    await saveTransactions([newTransaction])
  })
}

// categories
export const categories: ReadableAtom<Category[]> = computed(
  [loadedFullList],
  transactions => {
    const uniqueCategories = new Set<TransactionsCategory>()

    transactions.forEach(({ category }) => {
      uniqueCategories.add(category)
    })

    return Array.from(uniqueCategories).map(category => ({
      id: nanoid(),
      name: category
    }))
  }
)

export const filterByCategory = (name: TransactionsCategory | null) => {
  activeCategoryFilter.set(name)
}
