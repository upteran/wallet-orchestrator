<script lang="ts">
  import {
    balanceStore,
    transactionsHistory,
    sortedTransactionsHistory
  } from '../core/transactions/history-store'
</script>

{#if $transactionsHistory.length > 0}
  <table>
    <thead>
      <tr>
        <th>Transaction id</th>
        <th>Transaction date</th>
        <th>Transaction Name</th>
        <th>Transaction Sum</th>
        <th>Type</th>
        <th>Balance After Transaction</th>
      </tr>
    </thead>
    <tbody>
      {#each $sortedTransactionsHistory as transaction}
        <tr>
          <td>{transaction.id}</td>
          <td>{transaction.date}</td>
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
