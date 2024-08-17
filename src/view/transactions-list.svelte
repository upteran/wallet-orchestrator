<script lang="ts">
  import {
    sortedFullList,
    clearAllData,
    updateFullTransactionsByName, balance
  } from '@/core/transactions/store'
  import TransactionsTable from './transactions-table.svelte'
  // Clear all transactions
  const handleClearAllTransactions = () => {
    clearAllData()
  }
</script>

<div class="transaction-table-outer">
  <TransactionsTable
    transactions={sortedFullList}
    updateTransactionsByName={updateFullTransactionsByName}
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
