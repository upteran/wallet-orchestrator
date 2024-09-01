import type { Transaction } from '@core/transactions/models/transaction'
import type { Dayjs } from 'dayjs'
import { convertDateToCompare } from '@core/helpers/date'
import { formatToFixedNumber } from '@core/helpers/numbers'
import type { TransactionsCategory } from '@core/transactions/category'

export function groupTransactions(transactions: Transaction[]) {
  const transactionsMap = new Map<string, Transaction>()

  transactions.forEach(transaction => {
    const {
      id,
      transactionName,
      category,
      transactionSum,
      type,
      sumInBalanceCurrency,
      description,
      systemKey
    } = transaction

    if (transactionsMap.has(transactionName)) {
      const existing = transactionsMap.get(transactionName)!
      // @ts-expect-error todo: upd type or logic
      existing.transactionSum = 'merged'
      existing.sumInBalanceCurrency = formatToFixedNumber(
        existing.sumInBalanceCurrency + sumInBalanceCurrency
      )
    } else {
      transactionsMap.set(transactionName, {
        id,
        date: transaction.date,
        transactionName,
        systemKey,
        transactionSum: formatToFixedNumber(transactionSum),
        sumInBalanceCurrency: formatToFixedNumber(sumInBalanceCurrency),
        description,
        category,
        type
      })
    }
  })

  return Array.from(transactionsMap.values())
}

export const sortByDate = (a: Transaction, b: Transaction) => {
  const dateA = convertDateToCompare(a.date)
  const dateB = convertDateToCompare(b.date)

  return dateB.valueOf() - dateA.valueOf()
}

const sortBySumAsc = (a: Transaction, b: Transaction) => {
  return a.sumInBalanceCurrency - b.sumInBalanceCurrency
}

const sortBySumDesc = (a: Transaction, b: Transaction) => {
  return b.sumInBalanceCurrency - a.sumInBalanceCurrency
}

// Sort Types Map
const sortFunctionsMap: Record<
  string,
  (a: Transaction, b: Transaction) => number
> = {
  date: sortByDate,
  min: sortBySumAsc,
  max: sortBySumDesc
}

// Default sort key
const defaultSortKey = 'date'

// Sort Transactions Function
export const sortTransactions = (
  transactions: Transaction[],
  sortKey: string | null
): Transaction[] => {
  const sortFunction = sortFunctionsMap[sortKey || defaultSortKey]
  return transactions.sort(sortFunction)
}

export const sortBySum = (
  transactions: Transaction[],
  sortSumType: string | null
): Transaction[] => {
  if (!sortSumType) return transactions

  if (sortSumType === 'min') {
    return transactions.sort(
      (a, b) => a.sumInBalanceCurrency - b.sumInBalanceCurrency
    )
  } else if (sortSumType === 'max') {
    return transactions.sort(
      (a, b) => b.sumInBalanceCurrency - a.sumInBalanceCurrency
    )
  }

  return transactions
}

function filterByDates(
  list: Transaction[],
  startDate: Dayjs | null,
  endDate: Dayjs | null
) {
  return list.filter(t => {
    const transactionDate = convertDateToCompare(t.date)

    const start = startDate ? startDate : null
    const end = endDate ? endDate : null

    // Apply filtering logic
    const isAfterStart = start
      ? transactionDate.isAfter(start) || transactionDate.isSame(start, 'day')
      : true
    const isBeforeEnd = end
      ? transactionDate.isBefore(end) || transactionDate.isSame(end, 'day')
      : true
    return isAfterStart && isBeforeEnd
  })
}

function filterByCategoryName({
  categoryName,
  transactions
}: {
  categoryName: TransactionsCategory
  transactions: Transaction[]
}) {
  return transactions.filter(({ category }) => category === categoryName)
}

export const prepareTransactions = (
  isGroupingEnable: boolean,
  transactions: Transaction[],
  startDate: Dayjs | null,
  endDate: Dayjs | null,
  sortSumType: string | null,
  activeCategoryFilter: TransactionsCategory | null
) => {
  const t = activeCategoryFilter
    ? filterByCategoryName({ categoryName: activeCategoryFilter, transactions })
    : transactions
  const list = isGroupingEnable ? groupTransactions(t) : t

  // Filter by dates
  const filteredTransactions =
    startDate || endDate ? filterByDates(list, startDate, endDate) : list

  // Sort transactions by the selected sort key
  return [...(sortTransactions(filteredTransactions, sortSumType) || [])]
}
