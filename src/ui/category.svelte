<script lang="ts">
  import {
    categories
  } from '@core/transactions/store'
</script>

<div class="category-list">
  {#each $categories as category (category.id)}
    <div class="category-item">
      {category.name}
    </div>
  {/each}
</div>

<style>
  .category-list {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }

  .category-item {
    padding: 5px 10px;
    border: 2px solid #000;
    border-radius: 4px;
  }
</style>
