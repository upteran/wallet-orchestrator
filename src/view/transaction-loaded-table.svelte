<script lang="ts">
  import {
    balanceByLoadedData,
    resetStore,
    sortedLoadedList,
    updateLoadedTransactionsByName,
    groupedTransactionsEnabled,
    groupedLoadedList
  } from '@/core/transactions/store'
  import TransactionsTable from './transactions-table.svelte'
  // Clear all transactions
  const handleClearAllTransactions = () => {
    resetStore()
  }

  const transactions = groupedTransactionsEnabled
    ? groupedLoadedList
    : sortedLoadedList
</script>

<div class="transaction-table-outer">
  <TransactionsTable
    transactions={transactions}
    updateTransactionsByName={updateLoadedTransactionsByName}
  />
  <p>Overall Balance: {$balanceByLoadedData}</p>
  <button disabled={!sortedLoadedList} on:click={handleClearAllTransactions}
    >Clear All Transactions</button
  >
</div>

<style modul>
  .transaction-table-outer {
    max-width: 100%;
    overflow-y: auto;
  }
</style>
