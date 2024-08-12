import { atom } from 'nanostores'
import { commonTransactionsStore, balanceStore } from './transactions'

export const parsedDataStore = atom<Array<Record<string, unknown>>>([])

const csvParsers: Record<string, (data: string) => void> = {
  'oreon-bank': (data: string) => parseOreonBankCSV(data)
  // Add other CSV type parsers here
}

export const parseCSV = (data: string, csvType: string): void => {
  const parser = csvParsers[csvType]
  if (parser) {
    parser(data)
  } else {
    console.error(`No parser found for CSV type: ${csvType}`)
  }
}

export const parseOreonBankCSV = (data: string): void => {
  const parsedData: Array<Record<string, unknown>> = []

  const rows = data.split('\n').map(row => row.split(','))

  const transactions = rows.slice(4) // Skip the first 3 rows

  let lastBalance = balanceStore.get()

  transactions.forEach(transaction => {
    const [date, name, ...extra] = transaction

    if (extra.length >= 6) {
      const id = extra[0]
      const sum = parseFloat(extra[2])
      const type = extra[3] === 'Дт' ? 'outcome' : 'income'
      const balance = type === 'income' ? lastBalance + sum : lastBalance - sum

      parsedData.push({
        id,
        date,
        name,
        sum,
        type,
        balance
      })

      // console.log('parsedData', parsedData)

      commonTransactionsStore.set([
        ...commonTransactionsStore.get(),
        {
          id,
          transactionName: name,
          transactionSum: sum,
          type,
          balanceAfterTransaction: +balance.toFixed(2)
        }
      ])

      lastBalance = +balance.toFixed(2) // Update the balance after each transaction
    }
  })

  balanceStore.set(lastBalance)
  parsedDataStore.set(parsedData)
}
