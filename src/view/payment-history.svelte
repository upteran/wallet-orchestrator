<script lang="ts">
  import {
    balanceStore,
    commonTransactionsStore,
    transactions
  } from '../core/transactions'
</script>

{#if $commonTransactionsStore.length > 0}
  <table>
    <thead>
      <tr>
        <th>Transaction Name</th>
        <th>Transaction Sum</th>
        <th>Type</th>
        <th>Balance After Transaction</th>
      </tr>
    </thead>
    <tbody>
      {#each $transactions as transaction}
        <tr>
          <td>{transaction.id}</td>
          <td>{transaction.transactionName}</td>
          <td>{transaction.transactionSum}</td>
          <td>{transaction.type}</td>
          <td>{transaction.balanceAfterTransaction}</td>
        </tr>
      {/each}
    </tbody>
  </table>
  <p>Overall Balance: {$balanceStore}</p>
{/if}
