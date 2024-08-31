<script lang="ts">
  import {
    balanceByLoadedData,
    resetStore,
    updateLoadedTransactionsByName,
    loadedList,
    clearUpdatedTransactionsData
  } from '@/core/transactions/store'
  import TransactionsTable from './transactions-table.svelte'
  // Clear all transactions
  const handleClearAllTransactions = () => {
    resetStore()
    clearUpdatedTransactionsData()
  }
</script>

<TransactionsTable
  transactions={$loadedList}
  updateTransactionsByName={updateLoadedTransactionsByName}
/>
<p>Overall Balance: {$balanceByLoadedData.balance}</p>
<p>Overall Incomes: {$balanceByLoadedData.totalIncomes}</p>
<p>Overall Outcomes: {$balanceByLoadedData.totalOutcomes}</p>
<button disabled={!$loadedList.length} on:click={handleClearAllTransactions}
  >Clear All Transactions</button
>
