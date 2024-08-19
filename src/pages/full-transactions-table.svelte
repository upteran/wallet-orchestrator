<script lang="ts">
  import {
    clearAllData,
    updateFullTransactionsByName,
    balanceByFullHistory,
    loadedFullList
  } from '@core/transactions/store'
  import TransactionsTable from '@view/transactions-table.svelte'
  // Clear all transactions
  const handleClearAllTransactions = () => {
    clearAllData()
  }
</script>

<div class="transaction-table-outer">
  <TransactionsTable
    transactions={$loadedFullList}
    updateTransactionsByName={updateFullTransactionsByName}
  />
  <p>Overall Balance: {$balanceByFullHistory.balance}</p>
  <p>Overall Incomes: {$balanceByFullHistory.totalIncomes}</p>
  <p>Overall Outcomes: {$balanceByFullHistory.totalOutcomes}</p>
  <button
    disabled={!$loadedFullList.length}
    on:click={handleClearAllTransactions}>Clear All Transactions</button
  >
</div>

<style modul>
  .transaction-table-outer {
    max-width: 100%;
    overflow-y: auto;
  }
</style>
