<script lang="ts">
  import type { Transaction } from '@/core/transactions/models/transaction'
  import { CATEGORIES_NAMES } from '@/core/transactions/category'
  import DateFilter from '@/ui/date-filter.svelte'
  import {
    groupedTransactionsEnabled,
    toggleGroupedTransactions
  } from '@core/transactions/store'
  import Checkbox from '@/ui/checkbox.svelte'

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

<DateFilter />
<Checkbox
  clickHandler={toggleGroupedTransactions}
  toggler={$groupedTransactionsEnabled}
/>
<div class="transaction-table-outer">
  {#if transactions.length > 0}
    <table class="transaction-table">
      <thead>
        <tr>
          <th>id</th>
          <th>date</th>
          <th>Name</th>
          <th>Sum (CUR)</th>
          <th>sum (EUR)</th>
          <th>Type</th>
          <th>Description</th>
          <th>Category</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {#each transactions as transaction}
          <tr
            class:income={transaction.type === 'income'}
            class:outcome={transaction.type === 'outcome'}
          >
            <td class="truncate">{transaction.id}</td>
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
            <td>{transaction.description}</td>
            <td>
              {#if editingTransactionId === transaction.id}
                <select bind:value={editingCategory}>
                  {#each CATEGORIES_NAMES as category}
                    <option
                      value={category}
                      on:change={value => (editingCategory = value.target)}
                      >{category}</option
                    >
                  {/each}
                </select>
              {:else}
                <span on:click={() => startEditing(transaction)}
                  >{transaction.category}</span
                >
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

  .truncate {
    display: inline-block;
    max-width: 100px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  :global(.income td) {
    background: #2a3242;
  }
</style>
