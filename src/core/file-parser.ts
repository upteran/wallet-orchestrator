import {
  loadedByFileTransactions,
  transactionsUpdateKeys
} from './transactions/store'
import { convertCurrency } from './currency'
import {
  createTransaction,
  type Transaction,
  type TransactionUpdatedData
} from '@core/transactions/models/transaction'
import { formatDate } from '@core/helpers/date'

const csvParsers: Record<string, (data: string) => void> = {
  csv1: (data: string) => parseCSV1(data),
  csv2: (data: string) => parseCSV2(data)
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

function updateByExistTransaction({
  systemKey,
  updatedData
}: {
  systemKey: string
  updatedData: Record<string, TransactionUpdatedData> | null
}) {
  let name = systemKey
  let category = 'none'

  if (updatedData && updatedData[systemKey]) {
    name = updatedData[systemKey].transactionName ?? systemKey
    category = updatedData[systemKey].category ?? 'none'
  }

  return { name, category }
}

export const parseCSV1 = (data: string): void => {
  const parsedData: Transaction[] = []

  const rows = data.split('\n').map(row => row.split(','))

  const transactionsRow = rows.slice(4) // Skip the first 3 rows

  const updatedData = transactionsUpdateKeys.get()

  transactionsRow.forEach(t => {
    const [date, systemKey, ...extra] = t

    if (extra.length >= 6) {
      console.log('extra', extra)
      const id = extra[0]
      const sum = parseFloat(extra[2])
      const type = extra[3] === 'Дт' ? 'outcome' : 'income'

      const { name, category } = updateByExistTransaction({
        systemKey,
        updatedData
      })

      parsedData.push(
        createTransaction({
          id,
          category,
          type,
          transactionSum: sum,
          systemKey,
          sumInBalanceCurrency: sum,
          description: 'descr',
          transactionName: name,
          date: formatDate(date)
        })
      )
    }
  })
  loadedByFileTransactions.set([
    ...loadedByFileTransactions.get(),
    ...parsedData
  ])
}

export const parseCSV2 = (data: string): void => {
  const parsedData: Transaction[] = []
  // Split the CSV string into lines
  const rows = data.split('\n')
  // todo: make convert to dynamic balance currency when it will be dynamic
  const currencyConverter = convertCurrency({ from: 'AMD', to: 'EUR' })

  const lines = rows.slice(10)
  // Loop through each line and split it into fields

  const updatedData = transactionsUpdateKeys.get()

  lines.forEach(line => {
    // Split the line by comma, considering the possibility of commas inside quotes
    const fields = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g)

    if (fields && fields.length >= 6) {
      // todo: make null object
      // Extract the values based on the CSV structure
      const number = fields[0]
      const date = fields[2]
      // const currency = fields[3]
      const income = fields[4]
        ? parseFloat(fields[4].replace(/"/g, '').replace(/,/g, ''))
        : 0
      const outcome = fields[4]
        ? parseFloat(fields[5].replace(/"/g, '').replace(/,/g, ''))
        : 0
      const systemKey = fields[7]
      const description = fields[8]

      const csvSum = income || outcome
      const sum = currencyConverter(csvSum)
      const type = outcome ? 'outcome' : 'income'

      const { name, category } = updateByExistTransaction({
        systemKey,
        updatedData
      })

      parsedData.push(
        createTransaction({
          id: number,
          transactionSum: csvSum,
          sumInBalanceCurrency: sum,
          date: formatDate(date, 'DD/MM/YYYY'),
          type,
          transactionName: name,
          systemKey,
          description,
          category
        })
      )
    }
  })

  loadedByFileTransactions.set([
    ...loadedByFileTransactions.get(),
    ...parsedData
  ])
}
