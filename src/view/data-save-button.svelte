<script lang="ts">
  import { saveHistory } from '../core/transactions/history-store'

  function saveData() {
    saveHistory()
  }
</script>

<button on:click={saveData}>Add to Previous Data</button>
