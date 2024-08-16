import { atom, computed, onMount, task } from 'nanostores'
import type { Transaction } from './models/transaction'
import { initDB, loadTransactions, saveTransactions, updateTransactionInDB } from '../db'

export const balanceStore = atom<number>(0)
export const transactionsHistory = atom<Array<Transaction>>([])
export const groupedTransactionsEnabled = atom<boolean>(false)

onMount(transactionsHistory, () => {
  console.log('Mounted')
  task(async () => {
    const db = await initDB()
    if (db) {
      let transactions = []
      try {
        transactions = await loadTransactions()
      } catch (error) {
        console.log('Error loading transactions', error)
      }
      transactionsHistory.set(transactions)
    }
  })

  return () => {
    console.log('Unmounted')
  }
})

export const saveHistory = () =>
  task(async () => {
    const transactions = transactionsHistory.get()
    console.log('transactions', transactions)
    await saveTransactions(transactions)
  })

export const toggleGroupedTransactions = () =>
  groupedTransactionsEnabled.set(!groupedTransactionsEnabled.get())

const transactionsMap = new Map<string, Transaction>()

export const groupedTransactionsStore = computed(
  transactionsHistory,
  transactions => {
    console.log(transactions)
    transactions.forEach(transaction => {
      const {
        transactionName,
        category,
        transactionSum,
        type,
        balanceAfterTransaction,
        sumInBalanceCurrency,
        currency,
        description
      } = transaction

      if (transactionsMap.has(transactionName)) {
        const existing = transactionsMap.get(transactionName)!
        existing.transactionSum += transactionSum
        existing.balanceAfterTransaction = balanceAfterTransaction // Update balance after the last grouped transaction
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
          type,
          balanceAfterTransaction
        })
      }
    })

    return Array.from(transactionsMap.values())
  }
)

export const showedTransactionsHistory = atom<Array<Transaction>>()

export const sortedTransactionsHistory = computed(
  showedTransactionsHistory,
  transaction => {
    return transaction.sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime()
    })
  }
)

transactionsHistory.subscribe(tr => {
  let lastBalance = balanceStore.get()
  tr.forEach(t => {
    lastBalance =
      t.type === 'income'
        ? lastBalance + t.sumInBalanceCurrency
        : lastBalance - t.sumInBalanceCurrency
  })
  if (groupedTransactionsEnabled.get()) {
    showedTransactionsHistory.set(groupedTransactionsStore.get())
  } else {
    showedTransactionsHistory.set(transactionsHistory.get())
  }
  balanceStore.set(+lastBalance.toFixed(2))
})

groupedTransactionsEnabled.subscribe(v => {
  showedTransactionsHistory.set(
    v ? groupedTransactionsStore.get() : transactionsHistory.get()
  )
})

export function updateTransaction(id: string, newName: string, newCategory: string) {
  const transactions = transactionsHistory.get();

  const updatedTransactions = transactions.map(transaction => {
    if (transaction.id === id) {
      const updatedTransaction = {
        ...transaction,
        transactionName: newName,
        category: newCategory,
      };

      // Save the updated transaction to IndexedDB
      updateTransactionInDB(updatedTransaction);

      return updatedTransaction;
    }

    return transaction;
  });

  transactionsHistory.set(updatedTransactions);
}

export function updateTransactionsByName(originalName: string, newName: string, newCategory: string) {
  const transactions = transactionsHistory.get();

  const updatedTransactions = transactions.map(transaction => {
    if (transaction.transactionName === originalName) {
      const updatedTransaction = {
        ...transaction,
        transactionName: newName,
        category: newCategory,
      };

      // Save the updated transaction to IndexedDB
      updateTransactionInDB(updatedTransaction);

      return updatedTransaction;
    }

    return transaction;
  });

  transactionsHistory.set(updatedTransactions);
}
