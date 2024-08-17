<script lang="ts">
  import {
    transactionsHistory,
    clearAllData
  } from '@/core/transactions/history-store'
  import TransactionsTable from './transactions-table.svelte'
  // Clear all transactions
  const handleClearAllTransactions = () => {
    clearAllData()
  }
</script>

<div class="transaction-table-outer">
  <TransactionsTable transactions={transactionsHistory} />
  <button on:click={handleClearAllTransactions}>Clear All Transactions</button>
</div>

<style modul>
  .transaction-table-outer {
    max-width: 100%;
    overflow-y: auto;
  }
</style>
