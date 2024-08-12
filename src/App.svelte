<script lang="ts">
  import MethodSelect from './view/method-select.svelte'
  import FileReader from './view/file-reader.svelte'
  import TransactionsHistory from './view/payment-history.svelte'
  import Checkbox from './view/checkbox.svelte'

  import { groupedTransactionsEnabled, toggleGroupedTransactions } from './core/transactions'

</script>

<main>
  <MethodSelect />
  <FileReader />
  <Checkbox clickHandler={toggleGroupedTransactions} toggler={$groupedTransactionsEnabled} />
  <TransactionsHistory />
</main>
