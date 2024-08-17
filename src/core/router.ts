import { createRouter } from '@nanostores/router'

const routerConfig = {
  home: '/',
  loadHistory: '/load-history',
  transactionForm: '/transaction-form',
  transactionsHistory: '/transactions-history',
}

export const router = createRouter(routerConfig)

export type Route = keyof typeof routerConfig;
