<script lang="ts">
  import { saveHistory } from '@/core/transactions/store'

  function saveData() {
    saveHistory()
  }
</script>

<button on:click={saveData}>Add to Previous Data</button>
