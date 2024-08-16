import { openDB } from 'idb'
import type { DBSchema, IDBPDatabase } from 'idb'
import type { Transaction } from './transactions/models/transaction'

export interface TransactionDB extends DBSchema {
  transactions: {
    key: number
    value: Transaction
  }
}

const DB_NAME = 'TransactionsDB';
const STORE_NAME = 'transactions';

let db: IDBPDatabase<TransactionDB>

export const initDB = async () => {
  db = await openDB<TransactionDB>(DB_NAME, 1, {
    upgrade(db) {
      db.createObjectStore(STORE_NAME, {
        keyPath: 'id',
        autoIncrement: true
      })
    }
  })

  return db
}

export const saveTransactions = async (transactions: Array<Transaction>) => {
  const tx = db.transaction(STORE_NAME, 'readwrite')
  const store = tx.objectStore(STORE_NAME)
  for (const transaction of transactions) {
    await store.put(transaction)
  }
  await tx.done
}

export const loadTransactions = async () => {
  if (!db) {
    throw Error('Data base is not initialized')
  }

  const tx = db!.transaction(STORE_NAME, 'readonly')
  const store = tx.objectStore(STORE_NAME)
  const allTransactions = await store.getAll()
  await tx.done
  return allTransactions
}

export async function updateTransactionInDB(transaction: Transaction) {
  const tx = db.transaction(STORE_NAME, 'readwrite')
  const store = tx.objectStore(STORE_NAME)

  try {
    await store.put(transaction)
    await tx.done
  } catch (error) {
    console.error('Failed to update transaction in IndexedDB:', error)
  }
}

export async function deleteTransaction(id: string): Promise<void> {
  await db.delete(STORE_NAME, id);
}

export async function clearTransactions(): Promise<void> {
  await db.clear(STORE_NAME);
}
