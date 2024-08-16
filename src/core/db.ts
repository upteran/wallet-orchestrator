import { openDB } from 'idb'
import type { DBSchema, IDBPDatabase } from 'idb'
import type { Transaction } from './transactions/models/transaction'

export interface TransactionDB extends DBSchema {
  transactions: {
    key: number
    value: Transaction
  }
}

let db: IDBPDatabase<TransactionDB>

export const initDB = async () => {
  db = await openDB<TransactionDB>('csvTransactionsDB', 1, {
    upgrade(db) {
      db.createObjectStore('transactions', {
        keyPath: 'id',
        autoIncrement: true
      })
    }
  })

  return db
}

export const saveTransactions = async (transactions: Array<Transaction>) => {
  const tx = db.transaction('transactions', 'readwrite')
  const store = tx.objectStore('transactions')
  for (const transaction of transactions) {
    await store.put(transaction)
  }
  await tx.done
}

export const loadTransactions = async () => {
  if (!db) {
    throw Error('Data base is not initialized')
  }

  const tx = db!.transaction('transactions', 'readonly')
  const store = tx.objectStore('transactions')
  const allTransactions = await store.getAll()
  await tx.done
  return allTransactions
}

export async function updateTransactionInDB(transaction: Transaction) {
  const tx = db.transaction('transactions', 'readwrite')
  const store = tx.objectStore('transactions')

  try {
    await store.put(transaction)
    await tx.done
  } catch (error) {
    console.error('Failed to update transaction in IndexedDB:', error)
  }
}
