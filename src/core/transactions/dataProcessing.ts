import type { Transaction } from '@core/transactions/models/transaction'
import type { Dayjs } from 'dayjs'
import { convertDateToCompare } from '@core/helpers/date'
import { formatToFixedNumber } from '@core/helpers/numbers'

export function groupTransactions(transactions: Transaction[]) {
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

export const sortTransactions = (transactions: Transaction[]) => {
  return transactions.sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime()
  })
}

export const listPrepear = (
  isEnable: boolean,
  groupedList: Transaction[],
  sortedList: Transaction[],
  startDate: Dayjs | null,
  endDate: Dayjs | null
) => {
  const list = isEnable ? groupedList : sortedList
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
