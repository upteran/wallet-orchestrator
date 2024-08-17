<script lang="ts">
  import MethodSelect from '@/view/method-select.svelte'
  import AddManualTransaction from '@/view/add-manual-transaction.svelte'
  import LoadedTransactions from '@/view/loaded-transactions.svelte'
  import TransactionList from '@/view/transactions-list.svelte'
  import { router } from '@/core/router'
</script>

<main class="main">
  <div class="container-fluid">
    {#if $router.route === 'home'}
      <MethodSelect />
    {:else if $router.route === 'loadHistory'}
      <LoadedTransactions />
    {:else if $router.route === 'transactionForm'}
      <AddManualTransaction />
    {:else}
      <TransactionList />
    {/if}
  </div>
</main>

<style module>
  .main {
    margin: 1em 0;
  }
</style>
