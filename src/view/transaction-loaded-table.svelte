<script lang="ts">
  import {
    balanceByLoadedData,
    resetStore,
    updateLoadedTransactionsByName,
    loadedList
  } from '@/core/transactions/store'
  import TransactionsTable from './transactions-table.svelte'
  // Clear all transactions
  const handleClearAllTransactions = () => {
    resetStore()
  }
</script>

<div class="transaction-table-outer">
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
</div>

<style modul>
  .transaction-table-outer {
    max-width: 100%;
    overflow-y: auto;
  }
</style>
