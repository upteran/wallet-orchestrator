<script lang="ts">
  import {
    transactions,
    saveManualTransaction,
    updateFullTransactionsByName
  } from '@core/transactions/store'
  import { TRANSACTIONS_CATEGORY } from '@core/transactions/category'
  import TransactionsTable from '@/ui/transactions-table.svelte'

  let transactionName = ''
  let transactionSum: number | null = null
  let transactionType: 'income' | 'outcome' = 'income'
  let transactionCategory: string
  const categories = Object.values(TRANSACTIONS_CATEGORY)

  const handleSubmit = (event: Event) => {
    event.preventDefault()

    if (!transactionName || transactionSum === null) {
      alert('Please fill in all the fields.')
      return
    }

    saveManualTransaction({
      transactionName,
      transactionSum,
      type: transactionType,
      category: transactionCategory,
    })

    // Reset form fields
    transactionName = ''
    transactionSum = null
  }
</script>

<main>
  <TransactionsTable
    transactions={$transactions}
    updateTransactionsByName={updateFullTransactionsByName}
  />
</main>
<form on:submit={handleSubmit}>
  <div>
    <label for="transactionName">Transaction Name:</label>
    <input
      id="transactionName"
      required
      type="text"
      bind:value={transactionName}
    />
  </div>
  <div>
    <label for="transactionSum">Transaction Sum:</label>
    <input
      id="transactionSum"
      required
      type="number"
      bind:value={transactionSum}
    />
  </div>
  <div>
    <label for="transactionType">Type:</label>
    <select id="transactionType" required bind:value={transactionType}>
      <option value="income">Income</option>
      <option value="outcome">Outcome</option>
    </select>
  </div>
  <div>
    <label for="transactionCategory">Category:</label>
    <select id="transactionCategory" required bind:value={transactionCategory}>
      {#each categories as category}
        <option value={category}>{category}</option>
      {/each}
    </select>
  </div>
  <button type="submit">Add Transaction</button>
</form>
