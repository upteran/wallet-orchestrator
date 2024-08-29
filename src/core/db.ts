import { openDB } from 'idb'
import type { DBSchema, IDBPDatabase } from 'idb'
import type {
  Transaction,
  TransactionUpdatedData,
} from './transactions/models/transaction'

export interface TransactionDB extends DBSchema {
  transactions: {
    key: string
    value: Transaction
  }
  updatedTransactionsKeys: {
    key: string
    value: TransactionUpdatedData
  }
}

const DB_NAME = 'TransactionsDB'
const STORE_NAME = 'transactions'
const UPDATED_DATA_STORE = 'updatedTransactionsKeys'

let db: IDBPDatabase<TransactionDB>

export const initDB = async () => {
  if (db) {
    return db
  }

  db = await openDB<TransactionDB>(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, {
          keyPath: 'id',
          autoIncrement: true
        })
      }

      if (!db.objectStoreNames.contains(UPDATED_DATA_STORE)) {
        db.createObjectStore(UPDATED_DATA_STORE, {
          keyPath: 'systemKey'
        })
      }
    }
  })

  return db
}

// transactions
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
  await db.delete(STORE_NAME, id)
}

export async function clearTransactions(): Promise<void> {
  await db.clear(STORE_NAME)
  await db.clear(UPDATED_DATA_STORE)
}

// transactions updated data
export async function saveUpdatedTransaction(
  systemKey: string,
  data: TransactionUpdatedData
) {
  const tx = db.transaction(UPDATED_DATA_STORE, 'readwrite')
  const store = tx.objectStore(UPDATED_DATA_STORE)
  const dataToSave = { systemKey, ...data }

  // Save the object to the store without passing the key separately
  await store.put(dataToSave)
  await tx.done
}

// Retrieve updated transaction data for a given system key
export async function getUpdatedTransaction(systemKey: string) {
  const tx = db.transaction(UPDATED_DATA_STORE, 'readonly')
  const store = tx.objectStore(UPDATED_DATA_STORE)

  // Get the entire hash map
  const data = (await store.get(systemKey)) || {}

  await tx.done
  // Return the data for the specific system key
  return { [systemKey]: data }
}

function convertArrayToObject(
  list: (TransactionUpdatedData & { systemKey: string })[]
): Record<string, TransactionUpdatedData> {
  return list.reduce(
    (acc, { systemKey, ...rest }) => {
      acc[systemKey] = rest
      return acc
    },
    {} as Record<string, TransactionUpdatedData>
  )
}

export async function getAllUpdatedTransactions() {
  const tx = db.transaction(UPDATED_DATA_STORE, 'readonly')
  const store = tx.objectStore(UPDATED_DATA_STORE)

  // Get the entire hash map
  const l = (await store.getAll()) || []
  await tx.done
  // Return the data for the specific system key
  return convertArrayToObject(l) || {}
}
