import { nanoid } from 'nanoid'
import { formatDate } from '@core/helpers/date'
import type {TransactionsCategory} from "@core/transactions/category";

export interface Transaction {
  id: string | number
  systemKey: string
  date: string
  transactionName: string
  transactionSum: number
  sumInBalanceCurrency: number
  description: string
  category: TransactionsCategory
  type: 'income' | 'outcome'
}

export interface TransactionUpdatedData {
  transactionName?: string
  category?: string
}

export type TransactionsUpdatedData = Record<string, TransactionUpdatedData>

type CreateTransactionParams = Partial<Pick<Transaction, 'id' | 'date'>> &
  Pick<
    Transaction,
    | 'systemKey'
    | 'transactionName'
    | 'transactionSum'
    | 'sumInBalanceCurrency'
    | 'category'
    | 'description'
    | 'type'
  >

export function createTransaction({
  id = nanoid(),
  date = formatDate(new Date().toISOString()),
  systemKey,
  transactionName,
  transactionSum,
  sumInBalanceCurrency,
  category,
  description,
  type
}: CreateTransactionParams): Transaction {
  return {
    id,
    systemKey,
    date,
    transactionName,
    transactionSum,
    sumInBalanceCurrency,
    category,
    description,
    type
  }
}
