<script lang="ts">
  import {
    sortedFullList,
    clearAllData,
    groupedFullList,
    groupedTransactionsEnabled,
    updateFullTransactionsByName,
    balanceByFullHistory
  } from '@core/transactions/store'
  import TransactionsTable from '@view/transactions-table.svelte'
  // Clear all transactions
  const handleClearAllTransactions = () => {
    clearAllData()
  }

  const transactions = groupedTransactionsEnabled
    ? groupedFullList
    : sortedFullList
</script>

<div class="transaction-table-outer">
  <TransactionsTable
    transactions={transactions}
    updateTransactionsByName={updateFullTransactionsByName}
  />
  <p>Overall Balance: {$balanceByFullHistory}</p>
  <button on:click={handleClearAllTransactions}>Clear All Transactions</button>
</div>

<style modul>
  .transaction-table-outer {
    max-width: 100%;
    overflow-y: auto;
  }
</style>
