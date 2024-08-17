<script lang="ts">
  import FileReader from '@/view/file-reader.svelte'
  import TransactionHistory from '@/view/payment-history.svelte'
  import Checkbox from '@/view/checkbox.svelte'
  import DataSaveButton from '@/view/data-save-button.svelte'
  import {
    groupedTransactionsEnabled,
    toggleGroupedTransactions
  } from '@core/transactions/history-store'
</script>

<main>
  <FileReader />
  <Checkbox
    clickHandler={toggleGroupedTransactions}
    toggler={$groupedTransactionsEnabled}
  />
  <TransactionHistory />
  <DataSaveButton />
</main>
