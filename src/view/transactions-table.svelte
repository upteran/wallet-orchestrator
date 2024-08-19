<script lang="ts">
  import type { Transaction } from '@/core/transactions/models/transaction'

  export let transactions: readonly Transaction[]
  export let updateTransactionsByName: (
    originalName: string,
    newName: string,
    newCategory: string
  ) => void

  let editingTransactionId: string | number | null = null
  let editingTransactionName: string = ''
  let editingCategory: string = ''
  let originalTransactionName: string = ''

  const startEditing = (transaction: Transaction) => {
    editingTransactionId = transaction.id
    editingTransactionName = transaction.transactionName
    originalTransactionName = transaction.transactionName
    editingCategory = transaction.category
  }

  const saveChanges = () => {
    if (editingTransactionId) {
      updateTransactionsByName(
        originalTransactionName,
        editingTransactionName,
        editingCategory
      )
      editingTransactionId = null
    }
  }

  const cancelEditing = () => {
    editingTransactionId = null
  }
</script>

<div class="transaction-table-outer">
  {#if transactions.length > 0}
    <table class="transaction-table">
      <thead>
        <tr>
          <th>id</th>
          <th>date</th>
          <th>Name</th>
          <th>Sum</th>
          <th>sumInBalanceCurrency</th>
          <th>Type</th>
          <th>Currency</th>
          <th>Description</th>
          <th>Category</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {#each transactions as transaction}
          <tr>
            <td>{transaction.id}</td>
            <td>{transaction.date}</td>
            <td>
              {#if editingTransactionId === transaction.id}
                <input type="text" bind:value={editingTransactionName} />
              {:else}
                {transaction.transactionName}
              {/if}
            </td>
            <td>{transaction.transactionSum}</td>
            <td>{transaction.sumInBalanceCurrency}</td>
            <td>{transaction.type}</td>
            <td>{transaction.currency}</td>
            <td>{transaction.description}</td>
            <td>
              {#if editingTransactionId === transaction.id}
                <input type="text" bind:value={editingCategory} />
              {:else}
                {transaction.category}
              {/if}
            </td>
            <td>
              {#if editingTransactionId === transaction.id}
                <button on:click={saveChanges}>Save</button>
                <button on:click={cancelEditing}>Cancel</button>
              {:else}
                <button on:click={() => startEditing(transaction)}>Edit</button>
              {/if}
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  {/if}
</div>
<style modul>
  .transaction-table-outer {
    max-width: 100%;
    overflow-y: auto;
  }
</style>
