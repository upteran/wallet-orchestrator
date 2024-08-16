import { atom } from 'nanostores'
import { transactionsHistory, balanceStore } from './transactions/history-store'
import { convertCurrency } from './currency'

export const parsedDataStore = atom<Array<Record<string, unknown>>>([])

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

export const parseCSV1 = (data: string): void => {
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

      // todo: update to class or function that creat object of transaction
      // todo: save to store only after all will be parsed to optimize it
      transactionsHistory.set([
        ...transactionsHistory.get(),
        {
          id,
          date: date,
          transactionName: name,
          transactionSum: sum,
          sumInBalanceCurrency: sum,
          category: '',
          currency: 'EUR',
          description: 'descr',
          type,
          balanceAfterTransaction: +balance.toFixed(2)
        }
      ])

      lastBalance = +balance.toFixed(2) // Update the balance after each transaction
    }
  })

  parsedDataStore.set(parsedData)
}

export const parseCSV2 = (data: string): void => {
  // Split the CSV string into lines
  const rows = data.split('\n')
  // todo: make convert to dynamic balance currency when it will be dynamic
  const currencyConverter = convertCurrency({ from: 'AMD', to: 'EUR' })

  // Initialize an array to hold the parsed result
  const parsedData = []
  const lastBalance = balanceStore.get()
  const lines = rows.slice(10)
  // Loop through each line and split it into fields
  lines.forEach(line => {
    // Split the line by comma, considering the possibility of commas inside quotes
    const fields = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g)

    console.log('fields', fields)
    if (fields && fields.length >= 6) {
      // todo: make null object
      // Extract the values based on the CSV structure
      const number = fields[0]
      const date = fields[2]
      const currency = fields[3]
      const income = fields[4]
        ? parseFloat(fields[4].replace(/"/g, '').replace(/,/g, ''))
        : 0
      const outcome = fields[4]
        ? parseFloat(fields[5].replace(/"/g, '').replace(/,/g, ''))
        : 0
      const name = fields[7]
      const description = fields[8]

      // Add the parsed data to the array
      parsedData.push({ number, date, currency, income, outcome, name, description })

      const csvSum = income || outcome;
      const sum = currencyConverter(csvSum)
      const type = outcome ? 'outcome' : 'income'
      const balance = type === 'income' ? lastBalance + sum : lastBalance - sum

      // todo: update to class or function that creat object of transaction
      // todo: save to store only after all will be parsed to optimize it
      transactionsHistory.set([
        ...transactionsHistory.get(),
        {
          id: number,
          date: date,
          transactionName: name,
          transactionSum: csvSum,
          sumInBalanceCurrency: sum,
          description,
          currency,
          category: '',
          type: income ? 'income' : 'outcome',
          balanceAfterTransaction: +balance.toFixed(2)
        }
      ])
    }
  })
  console.log('parsedData', parsedData)

  parsedDataStore.set(parsedData)
}
