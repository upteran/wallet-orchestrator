<script lang="ts">
  import {
    clearAllData,
    updateFullTransactionsByName,
    balanceByFullHistory,
    loadedFullList
  } from '@core/transactions/store'
  import TransactionsTable from '@/ui/transactions-table.svelte'
  // Clear all transactions
  const handleClearAllTransactions = () => {
    clearAllData()
  }

  // let transactions = []

  // $: transactions = loadedFullList.get()
</script>

<TransactionsTable
  transactions={$loadedFullList}
  updateTransactionsByName={updateFullTransactionsByName}
/>
<p>Overall Balance: {$balanceByFullHistory.balance}</p>
<p>Overall Incomes: {$balanceByFullHistory.totalIncomes}</p>
<p>Overall Outcomes: {$balanceByFullHistory.totalOutcomes}</p>
<button disabled={!$loadedFullList.length} on:click={handleClearAllTransactions}
  >Clear All Transactions</button
>
