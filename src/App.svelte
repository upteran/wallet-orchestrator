<script lang="ts">
  import MethodSelect from '@/pages/method-select.svelte'
  import AddManualTransaction from '@/pages/add-manual-transaction.svelte'
  import TransactionLoader from '@/pages/transaction-loader.svelte'
  import FullTransactionList from '@/pages/full-transactions-table.svelte'
  import { router } from '@/core/router'
</script>

<main class="main">
  <div class="container-fluid">
    {#if $router.route === 'home'}
      <MethodSelect />
    {:else if $router.route === 'loadHistory'}
      <TransactionLoader />
    {:else if $router.route === 'transactionForm'}
      <AddManualTransaction />
    {:else}
      <FullTransactionList />
    {/if}
  </div>
</main>

<style module>
  .main {
    margin: 1em 0;
  }
</style>
