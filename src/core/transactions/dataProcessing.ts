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
      description,
      systemKey
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

export const prepareTransactions = (
  isEnable: boolean,
  transactions: Transaction[],
  startDate: Dayjs | null,
  endDate: Dayjs | null
) => {
  const list = isEnable ? groupTransactions(transactions) : transactions

  let res: Transaction[] | [] = list

  if (startDate || endDate) {
    res = filterByDates(list, startDate, endDate)
  }

  return res.sort(sortByDate)
}
