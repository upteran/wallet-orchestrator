<script lang="ts">
  import FileReader from '@/ui/file-reader.svelte'
  import TransactionLoadedTable from '@/ui/transaction-loaded-table.svelte'
  import DataSaveButton from '@/ui/data-save-button.svelte'
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
