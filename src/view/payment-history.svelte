<script lang="ts">
  import {
    balance,
    clearAllData,
    sortedLoadedList,
    updateLoadedTransactionsByName
  } from '@/core/transactions/store'
  import TransactionsTable from './transactions-table.svelte'
  // Clear all transactions
  const handleClearAllTransactions = () => {
    clearAllData()
  }
</script>

<div class="transaction-table-outer">
  <TransactionsTable
    transactions={sortedLoadedList}
    updateTransactionsByName={updateLoadedTransactionsByName}
  />
  <p>Overall Balance: {$balance}</p>
  <button on:click={handleClearAllTransactions}>Clear All Transactions</button>
</div>

<style modul>
  .transaction-table-outer {
    max-width: 100%;
    overflow-y: auto;
  }
</style>
