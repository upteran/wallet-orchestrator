import type { Values } from '@/types/global'

export const TRANSACTIONS_CATEGORY = {
  CASH: 'cash',
  GROCERIES: 'groceries',
  ENTERTAINMENT: 'entertainment',
  RESTAURANTS: 'restaurants',
  TRANSPORT: 'transport',
  UTILITIES: 'utilities',
  RENT: 'rent',
  MEDICAL: 'medical',
  INSURANCE: 'insurance',
  EDUCATION: 'education',
  SAVINGS: 'savings',
  INVESTMENTS: 'investments',
  DONATIONS: 'donations',
  TRAVEL: 'travel',
  SHOPPING: 'shopping',
  SUBSCRIPTIONS: 'subscriptions',
  INCOME: 'income',
  TAXES: 'taxes'
} as const

export const CATEGORIES_NAMES = Object.values(TRANSACTIONS_CATEGORY);

export type TransactionsCategory = Values<typeof TRANSACTIONS_CATEGORY>
