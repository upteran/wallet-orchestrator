<script lang="ts">
  import { saveHistory } from '@/core/transactions/store'

  function saveData() {
    saveHistory()
  }
</script>

<div class="save-btn-outer">
  <button class="outline" on:click={saveData}>Add to Previous Data</button>
</div>

<style module>
  .save-btn-outer {
    margin: 0.4em 0;
  }
</style>
