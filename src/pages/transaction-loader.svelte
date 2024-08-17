<script lang="ts">
  import FileReader from '@view/file-reader.svelte'
  import TransactionLoadedTable from '@view/transaction-loaded-table.svelte'
  import Checkbox from '@view/checkbox.svelte'
  import DataSaveButton from '@view/data-save-button.svelte'
  import {
    groupedTransactionsEnabled,
    toggleGroupedTransactions
  } from '@core/transactions/store'
</script>

<main>
  <FileReader />
  <Checkbox
    clickHandler={toggleGroupedTransactions}
    toggler={$groupedTransactionsEnabled}
  />
  <TransactionLoadedTable />
  <DataSaveButton />
</main>
